import string
from tokenize import String
from turtle import title
from flask import Flask, json
from flask_cors import CORS
from ytmusicapi import YTMusic
from flask import request
from json import JSONEncoder

ytmusic = YTMusic()


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


@api.route('/api/queue/', methods=['GET'])
def get_queue():
    return queue

@api.route("/")
def helloWorld():
   return "Hello, cross-origin-world!"

@api.route('/api/companies/', methods=['GET'])
def get_companies():
    return json.dumps(companies)

@api.route('/api/search/', methods=['POST'])
def get_results():
    print("hi")
    user_search = str(request.data)[2:-1]
    print(user_search)
    search_results = ytmusic.search(user_search, filter="songs", limit=10)
    print("founders")
    #search_result_list = json.JSONDecoder.decode(search_results)
    print("converted results")
    songs = []
    for search_result in search_results:
        try:
            songs.append(convert_video_song(search_result))
        except:
            print("An exception occurred")
    return json.dumps(songs, default=lambda obj: obj.__dict__)


if __name__ == '__main__':
    api.run() 
