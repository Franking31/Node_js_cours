const API = process.env.NEXT_PUBLIC_API_URL;
if(!API)
    throw new Error("la variable d'environement NEXT_PUBLIC_API_URL n'est pas definit");
export {API};