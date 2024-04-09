const serverUrl =
  process.env.NODE_ENV === "production"
    ? "http://jeans-research-server.vercel.app:3000"
    : "http://localhost:3000";

export async function getChat({ queryKey }) {
  const apiRes = await fetch(`${serverUrl}/chat`);
  if (!apiRes.ok) {
    //?on verra ça plus tard
    //throw new console.error("not ok");
  }
  return apiRes.json();
}

export async function getRemoved({ queryKey }) {
  const apiRes = await fetch(`${serverUrl}/removed`);
  if (!apiRes.ok) {
    //?on verra ça plus tard
    //throw new console.error("not ok");
  }

  return apiRes.json();
}
