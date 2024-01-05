const baseUri = "http://localhost:5678/api/"

export const getWorks = async () => {
    const request = await fetch(`${baseUri}works`);
    const works = await request.json()

    return works
}

export const getCategories = async () => {
    const request = await fetch(`${baseUri}categories`);
    const categories = await request.json()

    return categories
}

export const ajoutPhoto = async (props) => {
    const token = localStorage.getItem("token");
    let status = '';
    let formData = new FormData();    //formdata object

    formData.append('image', props.image);   //append the values with key, value pair
    formData.append('title', props.title);
    formData.append('category', props.category);
    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    };
    console.log("props: ", props);
    if(props){
        await fetch(`${baseUri}works`, requestOptions)
        .then(response => response.json())
        .then(data => console.log(data))
        .then(() => status = 'Ajout successful')
        .catch((error) => status = error.message);
        console.log(status);
        return status
    }
}

export const DeleteWork = async (props) => {
    let status = '';
    const token = localStorage.getItem("token");
    const requestOptions = {
        method: 'DELETE',
        headers: { 
            'Authorization': `Bearer ${token}`
        }
    };
    console.log("props: ", props);
    if(props){
        
        await fetch(`${baseUri}works/${props}`, requestOptions)
        .then(() => status = 'Delete successful')
        .catch((error) => status = error.message);
        // const aRetourner = await request.json()
        console.log(status);
        return status
    }
}