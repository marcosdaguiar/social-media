export const SerializeForm = (form) => {
    
    const formData = new FormData(form);
    
    const completeObject = {};
    for(let [key, value] of formData){
        completeObject[key] = value;

    }

    return completeObject;
}