export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body

  if (password === process.env.APP_PASSWORD) {
    res.setHeader('Set-Cookie', `app-password=${password}; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}; Path=/`)
    return res.status(200).json({ ok: true })
  }

  return res.status(401).json({ error: 'Wrong password' })
}
