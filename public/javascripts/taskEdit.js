document.addEventListener("DOMContentLoaded", async () => {
    //grabbing all the btn-edit-subtask buttons

const editBtnsArr = document.querySelectorAll('.btn-edit-task')

//iterate through an arr of buttons
for (let i = 0; i < editBtnsArr.length; i++) {
    const btn = editBtns[i];

    //add eventlistener for each button to have it editted 
    btn.addEventListener('click', (e) => {
        const taskId = e.target.id.split('-')[2]
            const res = await fetch(`/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content
                })
            });
        const data = await res.json()
                if (data.message === 'Success') {
                    const contentEle = document.getElementById(`${taskId}-content`)
                    console.log("CONTENT ELEMENT ",contentEle)
                    contentEle.innerHTML = data.body.content
                } else {

                };
    });
};

});