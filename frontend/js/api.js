const API = "http://localhost:8000";

async function sendMessage(opponent, message){

    const response = await fetch(`${API}/chat`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            opponent,
            message
        })
    });

    return await response.json();
}
