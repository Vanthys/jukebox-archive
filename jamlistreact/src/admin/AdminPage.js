import styled from "styled-components";
import React, { useRef } from "react";

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

const List = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;
`;

const ListItem = styled.li``;

const baseurl = 'http://localhost:5000'

const AdminPage = () =>{


    const headerRef = useRef(0);

    const InitializeApi = async () =>{
        if(headerRef.current === null && headerRef.current.value === "") return false;

        let data = {"auth": headerRef.current.value };
        fetch(baseurl + '/api/init/', {  
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(data)})
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to initialize");
            }
            return response.json();
        })
        .catch((error) => {
            console.log("Error:", error.message);
        })
    }

    return (
        <Container>
        <List>
            <ListItem>
            <h1 style={{ "fontFamily": "'Lobster', cursive" }}>Jukebox - AdminPage</h1>
            </ListItem>
            <ListItem>
            <label for="headers">Headers</label>
            <br/>
            <input ref={headerRef} type="text" id="in" name="headers"/>
            </ListItem>
            <ListItem>
                <block>
                    <button onClick={() => InitializeApi()}>Reload</button>
                </block>
            </ListItem>
            <ListItem>
                <List>
                    
                </List>
            </ListItem>
            <ListItem>
                    <button>Clear Queue</button>
            </ListItem>
            
            

        </List>
        </Container>

        
        


    );

}


export default AdminPage;