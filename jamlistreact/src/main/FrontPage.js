import React, { useEffect, useState, useRef } from "react";

import styled from 'styled-components';
import Card from "./Card";
import { debounce } from "lodash";
import ResultCard from "./ResultCard";
import { ToastContainer, toast } from 'react-toastify';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
display : flex;
flex: 1;
flex-direction : column;
justify-content: center;
text-align: center;
align-items: center;
width : 60%;
margin: auto;
padding: 0;
@media only screen and (max-width: 768px) {

 width: 90%;
    
  }
`;

const SearchContainer = styled.div`
position: sticky;
top: 1em;
width: 100%;
display: flex;
background-color: var(--main-color);
flex-direction: column;
margin: 0;
padding: 0 0.2em 0 0;
box-shadow: 0 8px 20px 0 rgba(0,0,0,0.5);

`;


const InputContainer = styled.div`
width: auto;
display: flex;
background-color: var(--main-color);
flex-flow: row no-wrap;


padding: 0.1em 0.1em 0.1em 0.1em ;
`;
const Spacer = styled.div`
width: 0.5em;
min-width: 0.5em;
height: 100%;
`;
const SearchBar = styled.input`
width: calc(100% - 2.5em);
background-color : var(--main-color);
color: white !important;
outline: none;
border: none;
caret-color: white;
font-size: 1.5em;

&:default{
    color: red;
}
&:focus{
    outline: none;
    border: none;
    color: var(--front-color);
}
&:active{
    outline: none;
    border: none;
    color: var(--front-color);
}

`;

const SearchButton = styled.button`
margin-left: auto;
outline: 0;
border: 0;
font-size: 1.35em;
background-color: var(--main-color);
height: 2em;
width: 2em;

transition: ease-in-out 0.2s;

&:hover{
    background-color: rgb(25,25,25);
}

&:active{
    background-color: rgb(0,0,0);
    outline: 1px solid rgb(0,0,0,1);
}
&:focus{
    outline: 1px solid rgb(0,0,0,0);
}

`;


const baseurl = 'http://localhost:5000'

const FrontPage = ({user}) => {

    //const [state, setState] = useState({ mList: [], queue: [], results: [] });
    const [queue, setQueue] = useState([]);
    const [results, setResults] = useState([]);
    const linkRef = useRef();



    useEffect(() => {
        loadQueue();
        setInterval(loadQueue, 1000);
    }, [])


    const loadQueue = async () =>{
        fetch(baseurl + '/api/queue/', { mode: 'cors' })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch the queue");
            }
            return response.json();
        })
        .then((data) => {
            setQueue(data);
        })
        .catch((error) => {
            console.log("Error:", error.message);
        })
        /*
        fetch(baseurl + '/api/queue/', { mode: 'cors' })
        .catch((e) => console.log("failed to load queue"))
        .then((response) => response.json())
        .then((data) => {setQueue(data)})
        */
    }

    const clickHandle = async () => {
        let url = {
            link: linkRef.current.value
        }
        //request(url)
    }
    const inputHandle = async () => {

        if (linkRef.current !== null) {
            if (linkRef.current.value !== '') {
                setResults(new Array(5).fill(null));
                //setState({ results: new Array(5).fill(null) });
                //console.log("should now reload");
                debouncedSearch(linkRef?.current?.value)
            }
            else {
                setResults([]);                
            }
        }
        else {
            setResults([]);
            //setState({ results: [] })
        }
    }

    const search = async (data) => {
        const response = await fetch(baseurl + '/api/search/', {
            method: 'POST',
            mode: 'cors',

            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        return response.json();

    }
    /* const queue = async (payload) => {
        const response = await fetch(baseurl + '/api/queue/',
            {
                method: 'POST',
                mode: 'cors',

                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ payload: payload })
            })
        return response.json();
    } */

    const submitRequest = async (payload) => {
        try {
            const response = await fetch(baseurl + '/api/queue/', {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payload: payload, user: user }),
            });
            //console.log(response);
            if (response.ok) {
                return 'success'; // Resolve the promise with a string for success
            } else {
                throw new Error('error'); // Resolve the promise with a string for error
            }
        } catch (error) {
            throw new Error('error'); // Handle errors and resolve the promise with a string for error
        }
    }
    //   async () => {
    //     fetch(baseurl + '/api/queue/',{method: 'POST',mode: 'cors',headers: {'Content-Type': 'application/json'},
    //             body: JSON.stringify({payload : payload})})
    //         }
    const reqeuestQueue = async (payload) => {
        try {
            await toast.promise(submitRequest(payload), {
                pending: 'Request is pending...',
                success: 'Request submitted 🎵',
                error: 'Request rejected 🤯'

            })
        }
        catch (e) {
            console.log("fetch failed");
        }

        await fetch(baseurl + '/api/queue/', { mode: 'cors' })
            .then((response) => response.json())
            .then((data) => {
                linkRef.current.value = "";
                setQueue(data);
                setResults([]);
            }).catch(() => console.log("error"))

    };


    
    const debouncedSearch = debounce(async (input) => {
        await search(linkRef.current.value).then((result) => {
            if (linkRef.current.value !== "")
                setResults([...result])
        }

        ).catch(() => {
            console.log("some error occured")
        });
    }, 200);





    //https://www.youtube.com/watch?v=fNPCmbDYY80
    return (
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <Container>
                <h1 style={{ "fontFamily": "'Lobster', cursive" }}>Jukebox</h1>
                <SearchContainer>
                    <InputContainer>
                        <Spacer />
                        <SearchBar ref={linkRef} placeholder="Search for title..." aria-placeholder="Search for title..."
                            onChange={() => inputHandle()}
                        />
                        <SearchButton>
                            <span role="img" aria-label="Add">🔍</span>
                        </SearchButton>

                    </InputContainer>

                    {
                        results.slice(0, 5).map((obj, index) => {
                            return <ResultCard key={index}
                                payload={obj} onClick={(payload) => reqeuestQueue(payload)}
                            />;
                        })}
                </SearchContainer>


                <p style={{ opacity: 0.7 }}>{queue.length > 0 ? "" : "Search for songs and queue them"}</p>
                {queue.map((obj, index) => {
                    return <Card song={obj.song} votes={obj.votes} voted={obj.votes.includes(user)} userid={user} loadQueue={loadQueue} key={index} />;
                })}


                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </Container>
        </SkeletonTheme>
    );


}
export default FrontPage;