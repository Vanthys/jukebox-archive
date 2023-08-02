import string
from tokenize import String
from flask import Flask, json
from flask_cors import CORS
from ytmusicapi import YTMusic, setup as ytsetup 
from flask import request
from json import JSONEncoder

ytmusic = YTMusic("oauth.json")
global playlistId
try:
    with open("playlist.config", 'r') as file:
            playlistId = file.read()
            
except Exception as e:
        print(f"Error: {e}")
        

companies = [{"id": 1, "name": "Company One"}, {"id": 2, "name": "Company Two"}]

api = Flask(__name__)
#cors = CORS(api, resources={r"/api/*": {"origins": "*"}})
CORS(api)

class AlbumArt:
    type = ""
    link = ""
    width = 0
    height = 0
    def __init__(self) -> None:
        pass


class Song:
    title = ""
    artists = []
    album = ""
    video_id = ""
    year = ""
    duration_seconds = 0
    isExplicit: False
    album_arts = []
    def __init__(self) -> None:
        self.artists = []
        self.album_arts = []
        pass

def convert_video_song(video_metadata):
    song = None
    song = Song()
    song.title = video_metadata["title"]
    for artist in video_metadata["artists"]:
        song.artists.append(artist["name"])
    song.album = video_metadata["album"]["name"]
    song.video_id = video_metadata["videoId"]
    song.year = video_metadata["year"]
    song.duration_seconds = video_metadata["duration_seconds"]
    song.isExplicit = video_metadata["isExplicit"]
    
    tmb = video_metadata["thumbnails"][0]
    url = str(tmb["url"])
    url = url.split('=')[0] + "="
    size = len(url)

    aa_s = AlbumArt()
    aa_s.type="small"
    aa_s.width=100
    aa_s.height=100
    aa_s.link = url + "w" + str(aa_s.width) + "-h" + str(aa_s.height)
    song.album_arts.append(aa_s)

    aa_m = AlbumArt()
    aa_m.type="medium"
    aa_m.width=500
    aa_m.height=500
    aa_m.link = url + "w" + str(aa_m.width) + "-h" + str(aa_m.height)
    song.album_arts.append(aa_m)

    aa_l = AlbumArt()
    aa_l.type="small"
    aa_l.width=1000
    aa_l.height=1000
    aa_l.link = url + "w" + str(aa_l.width) + "-h" + str(aa_l.height)
    song.album_arts.append(aa_l)
    return song

queue = []
userids = []


def sort_queue_by_votes(arr):
    return sorted(arr, key=lambda x: x["votes"], reverse=True)

def sort_playlist():
    serverqueue = ytmusic.get_playlist(playlistId, limit=None)["tracks"]
    idserverqueue = [entry["videoId"] for entry in serverqueue]

    #index_map = {elem: i for i, elem in enumerate(idserverqueue)}
    copyqueue_sorted = sort_queue_by_votes(queue)
    idqueue = [entry["song"]["videoId"] for entry in copyqueue_sorted]
    # Iterate through arr1 and move the elements in arr2 to match the order in arr1
    for id, index in idqueue:
        if id in idserverqueue:

            if idserverqueue.index(id) == idqueue.index(id):

            ytmusic.edit_playlist(playlistId=playlistId, moveItem= [str, str])

    for entry in reversed(queue):
        print(entry["song"]["videoId"])
    

def sync():
    #sort queue
    #sync to playlist
    return 0

@api.route('/api/logon/', methods=['GET'])
def logon():
    newid = "user" + str(len(userids)+1) #god i fucking hate python 
    userids.append(newid)
    return json.dumps(newid, default=lambda obj: obj.__dict__)

@api.route('/api/vote/', methods=['POST'])
def receive_vote():
    jsonres = json.loads(request.data)
    song = jsonres["payload"]
    user = jsonres["user"]
    for entry in queue:
        if entry['song'] == song:
            if user in entry['votes']:
                entry['votes'].remove(user)
            else:
                entry['votes'].append(user)
            return "Success", 200
    else:
        return "Entry not found, have you requested the song?", 400

@api.route('/api/queue/', methods=['POST'])
def add_queue():
    jsonres = json.loads(request.data)
    song = jsonres["payload"]
    user = jsonres["user"]
    entry = {'song': song, 'votes' : [user]} 
    if not any(item['song'] == song for item in queue):
        queue.append(entry)
    else:
        for entry in queue:
            if entry['song'] == song:  
                entry['votes'].append(user)
                break
    print(queue)
    return queue

@api.route('/api/queue/', methods=['GET'])
def get_queue():
    #print(queue)
    return queue



@api.route('/api/init/', methods=['POST'])
def initialize():
    #jsonres = json.loads(request.data)
    #headers = ytsetup("config.json", headers_raw=jsonres["auth"])
    #global ytmusic,
    global playlistId
    #ytmusic = YTMusic(headers)
    playlistId = ytmusic.create_playlist("Jukebox", "Jukebox test playlist")
    try:
        with open("playlist.config", 'w') as file:
            file.write(playlistId)
    except Exception as e:
        print(f"Error: {e}")
    return playlistId




@api.route("/")
def helloWorld():
   return "Hello, cross-origin-world!"

@api.route('/api/companies/', methods=['GET'])
def get_companies():
    return json.dumps(companies)

@api.route('/api/search/', methods=['POST'])
def get_results():
    user_search = str(request.data)[2:-1]
    print(user_search)
    search_results = ytmusic.search(user_search, filter="songs", limit=10)
    #search_result_list = json.JSONDecoder.decode(search_results)
    songs = []
    for search_result in search_results:
        try:
            songs.append(convert_video_song(search_result))
        except:
            print("An exception occurred")
    return json.dumps(songs, default=lambda obj: obj.__dict__)


if __name__ == '__main__':
    api.run() 
