import { serialize } from 'cookie'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body

  if (password === process.env.APP_PASSWORD) {
    res.setHeader('Set-Cookie', serialize('app-password', password, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    }))
    return res.status(200).json({ ok: true })
  }

  return res.status(401).json({ error: 'Wrong password' })
}
