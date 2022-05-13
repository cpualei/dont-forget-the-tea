document.addEventListener("DOMContentLoaded", async () => {

    const deleteBtnsArr = document.querySelectorAll('.btn-delete-subtask')
    console.log("DELETE BTN ARR ", deleteBtnsArr)
    deleteBtnsArr.forEach( btn => {
        btn.addEventListener('click', async(e) => {
            e.preventDefault()
            console.log("E TARGET ", e.target)
            const subtaskId = e.target.id.split('-')[2]
            console.log("SUBTASK ID: ", subtaskId)
            const res = await fetch(`/subtasks/${subtaskId}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (data.message === 'Success') {
                const container = document.getElementById(`subtask-container-${subtaskId}`)
                container.remove()
            }
        })

})
    })