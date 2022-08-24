import React from "react";
import styled from 'styled-components';
import Card from "./Card";
import { debounce } from "lodash";
import ResultCard from "./ResultCard";

const Container = styled.div`
display : flex;
flex-direction : column;
justify-content: center;
text-align: center;
align-items: center;
width : 80%;
margin: auto;

`;

const SearchContainer = styled.div`
width: 70%;
display: flex;
background-color: var(--main-color);
flex-flow: column wrap;
margin: 0;
padding: 0;
`;


const InputContainer = styled.div`
width: 100%;
display: flex;
background-color: var(--main-color);
flex-flow: row no-wrap;
box-shadow: 0 8px 20px 0 rgba(0,0,0,0.25);
margin-bottom: 3em;
padding: 0.1em 0.1em 0.1em 1em ;
`;

const SearchBar = styled.input`
width: 95%;
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

class FrontPage extends React.Component{
   
    constructor(props){
        super(props);
        this.state =  {
            mList : [],
            results : []
        };
        this.linkref = React.createRef();
        
    }

    componentDidMount(){
        fetch(baseurl + '/api/queue/',{ mode: 'cors'})
        .then((response) => response.json())
        .then((data) => this.setState({mList : data}));
        
    }
    /*
    componentDidUpdate(){
        fetch('http://localhost:5000/api/queue',{ mode: 'cors'})
        .then((response) => response.json())
        .then((data) => this.setState({mList : data}));
    }
    */
 
    //THIS IS NOW OBSOLETE
    async clickHandle(){
        let url = {
            link : this.linkref.current.value  
        } 
        console.log(url);
        await this.request(url)
    }
    async inputHandle(){
        
        if(this.linkref.current !== null){
            if(this.linkref.current.value!== ''){
              this.debouncedSearch(this.linkref.current.value)
            }
            else {
                this.setState({results : []})
            }
        }
        else{
            this.setState({results : []})
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

    debouncedSearch = debounce(async (input) => {
        await this.search(this.linkref.current.value).then( (result) =>
                {
                    if(this.linkref.current.value!=="")
                    this.setState({results : result})

                }
                
                ).catch( () => {
                console.log("some error occured")
                });
    }, 200);


    async request(data) {
        // Default options are marked with *
        const response = await fetch(baseurl + '/api/request/', {
          method: 'POST',
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    //https://www.youtube.com/watch?v=fNPCmbDYY80
    render (){
        return(
            <Container>
                <h1>Jukebox</h1>
                <SearchContainer>
                    <InputContainer>
                    <SearchBar ref={this.linkref} placeholder="Search for title..." aria-placeholder="Search for title..."
                    onChange={() => this.inputHandle()}
                    />
                    <SearchButton onClick={() => this.clickHandle()}>
                    <span role="img" aria-label="Add">🔍</span> 
                    </SearchButton>
                    
                    </InputContainer>
                    
                    {this.state.results.slice(0, 5).map((obj, index) => {
                    return <ResultCard key={index}
                    payload={obj}
                    />;
                })}
                </SearchContainer>
                
                
                
                {this.state.mList.map((obj, index) => {
                    return <Card payload={obj}  key={index} />;
                })}
                

            </Container>

        );
    }

}
export default FrontPage;