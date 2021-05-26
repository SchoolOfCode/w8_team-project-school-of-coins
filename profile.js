// Profile Functions ######################################################

const AVATAR_URL = "https://avatars.dicebear.com/api/bottts";
const styleOptions = {
    "colors": ["amber", "blue", "blueGrey", "brown", "cyan", "deepOrange", "deepPurple",
    "green", "grey", "indigo", "lightBlue", "lightGreen", "lime", "orange", "pink", "purple",
    "red", "teal", "yellow"],
    "colorful":"false",//Use different colors for body parts
    "primaryColorLevel":600, //Default 600. 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
    "secondaryColorLevel":400, //Default 400.50, 100, 200, 300, 400, 500, 600, 700, 800, 900
    "textureChance": 50, //Texture Probability 0-100
    "mouthChance": 100, //Mouth Probability 0-100
    "sidesChance": 100, //Sides Probability 0-100
    "topChance": 100    //Top Probability 0-100
}
async function loadProfile(){
    /*#################################################################
    Use this to load the profile, generate the avatar with the seed (name)
    Once the profile has been loaded, show the start game button
    Reset the game board on clicking load profile
    #################################################################*/
    username = usernameInputElement.value;
    let user = blackjackPlayers.loadPlayer(username);
    let computer = blackjackPlayers.player("Dealer");
    usernameAvatarContainerElem.classList.remove("username-avatar-container");
    usernameAvatarContainerElem.classList.add("username-avatar-container-game");
    document.querySelector("#splash-image").style.display = "none";
    // if (document.documentElement.clientWidth > 600){
    //     document.querySelector("body").style.backgroundImage ="url('images/SOCtable.png')";
    // }
    playerBalanceDisplay.innerHTML="";
    let prevAvatarImage = document.querySelector(".avatar-picture");
    if (prevAvatarImage  !== null){
        playerAvatarElem.removeChild(prevAvatarImage);
    }

    resetBoard(computer,user);
    addBalanceContainer.classList.remove("hidden");
    let profileImg = document.createElement("img");
    profileImg.src = await getAvatar(user.username);
    profileImg.classList.add("avatar-picture");
    profileImg.id = `${user.username}-avatar`;
    user.avatar = profileImg.src;
    if (user.avatar !== null){
        
        playerAvatarElem.appendChild(profileImg);
    }

    playerBalanceDisplay.innerHTML = `<p>Balance: <span id='current-balance'>${user.balance}</span> Credits</p>`;
    startGameBtn.classList.remove("hidden");
}

async function getAvatar(seed=username,width=200,height=200,backgroundColor="transparent", styleFurther=false){
    //Need to add some error catching here if avatar generation fails
    //Need to add additional style options
    let avatarParameters = `/:${seed}.svg?background=${backgroundColor}&width=${width}&height=${height}`;
    const avatarSrc = await fetch(AVATAR_URL+avatarParameters);
    return avatarSrc.url;
}