import React from "react";
import styled from 'styled-components';
import Card from "./Card";
import { debounce } from "lodash";
import ResultCard from "./ResultCard";
import { ToastContainer, toast } from 'react-toastify';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
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

class FrontPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mList: [],
            results: []
        };
        this.linkref = React.createRef();

    }

    componentDidMount() {
        fetch(baseurl + '/api/queue/', { mode: 'cors' })
            .then((response) => response.json())
            .then((data) => this.setState({ mList: data }));

    }
    /*
    componentDidUpdate(){
        fetch('http://localhost:5000/api/queue',{ mode: 'cors'})
        .then((response) => response.json())
        .then((data) => this.setState({mList : data}));
    }
    */

    //THIS IS NOW OBSOLETE
    async clickHandle() {
        let url = {
            link: this.linkref.current.value
        }
       // console.log(url);
        await this.request(url)
    }
    async inputHandle() {

        if (this.linkref.current !== null) {
            if (this.linkref.current.value !== '') {
                this.setState({results: new Array(5).fill(null)});
                console.log("should now reload");
                this.debouncedSearch(this.linkref.current.value)
            }
            else {
                this.setState({ results: [] })
            }
        }
        else {
            this.setState({ results: [] })
        }
    }

    async search(data) {
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
    async queue(payload) {
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
    }

    async submitRequest(payload) {
        try {
            const response = await fetch(baseurl + '/api/queue/', {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payload: payload }),
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
    async reqeuestQueue(payload) {
        try {
            await toast.promise(this.submitRequest(payload), {
                pending: 'Request is pending...',
                success: 'Request submitted 🎵',
                error: 'Request rejected 🤯'

            })
                .then(fetch(baseurl + '/api/queue/', { mode: 'cors' })
                    .then((response) => response.json())
                    .then((data) => {
                        this.setState({ mList: data })
                        this.linkref.current.value = "";
                        this.setState({ results: [] });
                    })
                ).catch(console.log("fetch failed"));
        }
        catch (e) {
            console.log("fetch failed");
        }
    };

    debouncedSearch = debounce(async (input) => {
        await this.search(this.linkref.current.value).then((result) => {
            if (this.linkref.current.value !== "")
                this.setState({ results: result})

        }

        ).catch(() => {
            console.log("some error occured")
        });
    }, 200);


    // async request(data) {
    //     // Default options are marked with *
    //     const response = await fetch(baseurl + '/api/request/', {
    //       method: 'POST',
    //       mode: 'cors', // no-cors, *cors, same-origin
    //       cache: 'no-cache',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify(data) // body data type must match "Content-Type" header
    //     });
    //     return response.json(); // parses JSON response into native JavaScript objects
    // }



    //https://www.youtube.com/watch?v=fNPCmbDYY80
    render() {
        return (
            <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <Container>
                <h1 style={{"fontFamily": "'Lobster', cursive"}}>Jukebox</h1>
                <SearchContainer>
                    <InputContainer>
                        <Spacer />
                        <SearchBar ref={this.linkref} placeholder="Search for title..." aria-placeholder="Search for title..."
                            onChange={() => this.inputHandle()}
                        />
                        <SearchButton onClick={() => this.clickHandle()}>
                            <span role="img" aria-label="Add">🔍</span>
                        </SearchButton>

                    </InputContainer>
                    
                    { 
                    this.state.results.slice(0, 5).map((obj, index) => {
                        return <ResultCard key={index}
                            payload={obj} onClick={(payload) => this.reqeuestQueue(payload)}
                        />;
                    })}
                </SearchContainer>
               

                <p>{this.state.mList.length > 0 ? "" : "Search for songs and queue them."}</p>
                {this.state.mList.map((obj, index) => {
                    
                    return <Card payload={obj} key={index} />;
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

}
export default FrontPage;