

    const checkboxArr = document.querySelectorAll('.check-to-complete')

        checkboxArr.forEach(checkbox => {
            
            checkbox.addEventListener('change', async(e) => {
                console.log("THIS IS CHECK BOX ", checkbox)
                const taskId = e.target.id.split('-')[2]
                console.log("THIS IS THE TASK ID TO CHECK------", taskId)
                const res = await fetch(`/tasks/completed/${taskId}`,{
                method: 'POST'
            })
        })

        })


