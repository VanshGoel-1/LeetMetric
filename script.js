document.addEventListener("DOMContentLoaded", function(){
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input"); 
    const statsContainer = document.querySelector(".stats-container"); 
    const easyProgressCircle = document.querySelector(".easy-progress"); 
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress"); 
    const easyLabel = document.getElementById("easy-label"); 
    const mediumLabel = document.getElementById("medium-label"); 
    const hardLabel = document.getElementById("hard-label"); 
    const cardStatsContainer = document.querySelector(".stats-cards");


    function is_valid(username){
        if(username.trim() === ""){
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9](?:[a-zA-Z0-9_-]{0,13}[a-zA-Z0-9])?$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        // Use local backend proxy to avoid CORS issues
        const url = `http://localhost:3001/api/user/${username}`;
        try{
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch details");
            }
            const data = await response.json();
            console.log("Logging Data: ", data);

            displayUserData(data);
        }
        catch(error){
            statsContainer.innerHTML = `<p>No data found</p>`;
        }
        finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false; 
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(data){
        const totalQues = data.totalQuestions;
        const totalEasyQues = data.totalEasy;
        const totalMediumQues = data.totalMedium;
        const totalHardQues = data.totalHard;

        const totalSolvedQues = data.totalSolved;
        const totalSolvedEasy = data.easySolved;
        const totalSolvedMedium = data.mediumSolved;
        const totalSolvedHard = data.hardSolved;
        
        updateProgress(totalSolvedEasy, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(totalSolvedMedium, totalMediumQues, mediumLabel,mediumProgressCircle);
        updateProgress(totalSolvedHard, totalHardQues, hardLabel, hardProgressCircle);
    }

    searchButton.addEventListener('click', function(){
        const username = usernameInput.value;
        console.log('login username: ',username);
        if(is_valid(username)){
            fetchUserDetails(username);
        }
    })
})