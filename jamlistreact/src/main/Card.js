import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
width: 70%;
heigth: 20%;
display: flex;
flex-flow: row wrap;
background-color: var(--main-color);
justify-content: space-around;
margin-bottom: 1em;
padding: 0.5em;
box-shadow: 0 8px 20px 0 rgba(0,0,0,0.25);
transition: ease-in-out 0.2s;

&:hover {
    box-shadow: 0 8px 20px 0 rgba(0,0,0,0.5);
}

`;

const Thumbnail = styled.img`
width: 100%;

`;

const ThumbContainer = styled.div`
overflow: hidden;
max-width: 15em;
`;

const InformationContainer = styled.div`
display: flex;
flex-direction: column;
justify-center: flex-start;
padding: 1em;
`;

const VoteButton = styled.button`
background-color: white;
height: 4em;
width: 4em;
background-color: var(--main-color);
border-radius: 1em;
border: 2px solid rgb(187, 232, 252, 0);
transition: ease-in-out 0.2s;

&:hover{
    background-color: #ededed;
}

&:active{
    border: 2px solid rgb(187, 232, 252, 0.5);
}
`;

const VoteGroup = styled.div`
display: flex;
flex-direction: column;
&>* {
    margin: 0.5em 0.5em 0.5em 0.5em;
}

`;


function Card(props){
    
    const DoVote = async(link, type) => {
        let vote = {
            target : link,
            vote : type
        }

        const response = await fetch('http://localhost:3001/api/vote/', {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(vote) // body data type must match "Content-Type" header
          });
          return response.json(); // parses JSON response into native JavaScript objects
    }
    

    return (
        <CardContainer>
            <ThumbContainer>
            <Thumbnail src={props.payload.thumbnail_url} alt="Thumbnail"></Thumbnail>
            </ThumbContainer>
            <InformationContainer>
            <h2>{props.payload.title}</h2>
            <h3>{props.payload.author}</h3>
            
            </InformationContainer>
            <VoteGroup>
            <h5>{props.payload.votes}</h5>

            <VoteButton onClick={() => DoVote(props.link, 1)}><span role="img" aria-label="Upvote">👍</span></VoteButton>

            <VoteButton onClick={() => DoVote(props.link, -1)}><span role="img" aria-label="Downvote">👎</span></VoteButton>
            </VoteGroup>
          
            
        </CardContainer>
    );
}

export default Card;