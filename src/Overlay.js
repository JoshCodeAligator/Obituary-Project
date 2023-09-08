import React, {useState, useEffect} from "react";
import AWS from 'aws-sdk'
import { uploadFile } from 'react-s3';

const config = {
    bucketName: "speech-and-images",
    region: "ca-central-1",
    accessKeyId: "AKIASZO44E7RHS5XIPMD",
    secretAccessKey: "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",
}


export default function Overlay() {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [death, setDeath] = useState("");


  const submitImage = () => {
    const data = new FormData()
    data.append("file", image);
    data.append("upload_preset", "upload")
    data.append("cloud_name", "dqn6jivam")
    fetch("https://api.cloudinary.com/v1_1/dqn6jivam/image/upload", {
      method: "post",
      body: data
    }).then((res) => res.json()).then((data) => console.log(data)).catch((err) => console.log(err)) 
  }
  const toggleModal = () => {
      document.querySelector(".add-ob").style.pointerEvents = "auto";
      const playBtns = document.querySelectorAll(".play-button")
      const obituaries = document.querySelectorAll(".obituary")
      for(let i = 0; i<obituaries.length; i++) {
          playBtns[i].style.pointerEvents = "auto";
          obituaries[i].style.pointerEvents = "auto";
          obituaries[i].style.opacity = "1";
      }
      document.querySelector(".add-ob").disabled = false;
      document.getElementById("modal").style.display = "none";
      document.getElementById("navbar").style.opacity = "1";
      document.getElementById("noob-text").style.opacity = "1";
  }


    const callLambdaFunction = async () => {
      const iKey = image.name.split(".");
        try {
          const response = await fetch('https://uguzljm7w6ivh5m3kz23hg2cga0rrkuu.lambda-url.ca-central-1.on.aws/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              name: name,
              s3_key: iKey[0],
              born: birth,
              died: death
             })
          });
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      };

    const addObituary = (event) => {
      event.preventDefault();
      console.log("testing functionality")
 
      submitImage();
      callLambdaFunction();


          
      //call the step functions then exit modal
        toggleModal();    
      }

    return (
        <div id="modal">
            <span onClick={toggleModal} class="exit-modal">X</span>
            <h2>Create a New Obituary</h2>
            <span class="icon">&#9766;</span>
            <form class="form">
                <div class="file-upload-format">
                  <label for="file-upload" class="custom-file-upload">
                      Select an image for the deceased
                  </label>
                  <input id="file-upload" type="file" content="Select an image for the deceased" onChange={(e) => setImage(e.target.files[0])} required/>
                </div>
                <input id="name-of-person" type="text" placeholder="Name of the deceased" required onChange={(e) => setName(e.target.value)}/>
                <div class="dates">
                    <label id="birth-date">
                        <em>Born:</em>
                    </label>
                    <input id="birth-date" type="datetime-local" onChange={(e) => setBirth(e.target.value)} required/>
                    <label id="death-date">
                        <em>Died:</em>
                    </label>
                    <input id="death-date" type="datetime-local" onChange={(e) => setDeath(e.target.value)} required/>
                </div>
                <button onClick={(e) => addObituary(e)} class="write-ob" type="submit">Write Obituary</button>
            </form>
        </div>
    )
}