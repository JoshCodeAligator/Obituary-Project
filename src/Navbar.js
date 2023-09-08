import React, {useState, useEffect} from 'react';

function Navbar() {
    const toggleModal = () => {
        document.querySelector(".add-ob").style.pointerEvents = "none";
        const playBtns = document.querySelectorAll(".play-button");
        const obituaries = document.querySelectorAll(".obituary");
        for(let i =0; i<playBtns.length; i++) {
            playBtns[i].style.pointerEvents = "none";
            obituaries[i].style.pointerEvents = "none";
            obituaries[i].style.opacity = "0.1";
        }

        document.querySelector(".add-ob").disabled = true;
        document.getElementById("modal").style.display = "flex";
        document.getElementById("navbar").style.opacity = "0.1";
        document.getElementById("noob-text").style.opacity = "0.1";
    }
    
    return (
        <div id="navbar">
            <h1 class="header">The Last Show</h1>
            <h3 onClick={toggleModal} class="add-ob">+ New Obituary</h3>
        </div>
    )
}

export default Navbar;