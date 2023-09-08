import React, {useState, useEffect} from 'react';

export default function Obituaries() {
    const [data, setData] = useState(null);
    const [hide, setHide] = useState(false);

    const [audio] = useState('')
    useEffect(() => {
        async function fetchData() {
            const response = await fetch("https://pmptj5ahjkpfoamxjzbbwryg5a0giswr.lambda-url.ca-central-1.on.aws/");
            const data = await response.json();
            setData(data);
        }      
        fetchData();
    }, [data]);


    const playAudio = (src) => {
        let audio = new Audio();
        audio.src = src;
        audio.play();
    }
    let images = document.querySelectorAll(".obi-image")
    let names = document.querySelectorAll('.obi-name');
    let dates = document.querySelectorAll('.obi-dates');
    let descriptions = document.querySelectorAll('.obi-description');
    let playBtns = document.querySelectorAll('.button');

   if(images.length > 0) {
        for(let i = 0; i < images.length; i++) {
            images[i].addEventListener("click", () => {
                if(hide) {
                    names[i].style.display = "block";
                    dates[i].style.display = "block";
                    descriptions[i].style.display = "block";
                    playBtns[i].style.display = "block";

                } else {
                    names[i].style.display = "none";
                    dates[i].style.display = "none";
                    descriptions[i].style.display = "none";
                    playBtns[i].style.display = "none";
                }
                setHide(!hide);
            })
        }
   }

    return (
        <div>
            {
                //Add obituaries here
                data ? (<div id="obituaries">{data.map((item) => (
                    <div class="obituary">
                        <img class="obi-image" src={"https://res.cloudinary.com/dqn6jivam/image/upload/v1621910184/" + item.s3_key['S']} min-width="250px" min-height="275px"/>
                        <h3 class="obi-name">{item.name['S']}</h3>
                        <p class="obi-dates"><span class="obi-birth">{item.birth['S']}</span> - <span class="obi-death">{item.died['S']}</span></p>
                        <p class="obi-description">{item.description['S']}</p> 
                        <div class="button">
                            <div class="empty-space"></div> 
                            <span class="play-button" onClick={() => playAudio("https://res.cloudinary.com/dqn6jivam/video/upload/v1621910184/" + item.s3_key['S'].split(".")[0] + "Mp3.mp3")}>▶</span>
                            <div class="empty-space"></div>
                        </div>    
                        
                    </div>
                ))}{
                }</div>) : (<h2 id="noob-text">No Obituary Yet. </h2>)
            }
        </div> 
    )
}