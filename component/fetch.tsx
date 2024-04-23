export async function fetchURLs(urls: string[]):Promise<any[]>{
  const promises = urls.map(async (url)=>{
    const response = await fetch(url)
    return await response.json()
  })

  const data = await Promise.all(promises)
  
  return data
}