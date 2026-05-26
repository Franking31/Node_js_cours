const apiUrl = typeof window === 'undefined'
  ? process.env.API_URL           // serveur
  : process.env.NEXT_PUBLIC_API_URL  // navigateur