import jwt from 'jsonwebtoken'

// Attaches req.userId if the request has a valid "Bearer <token>" header.
// Blocks the request with 401 otherwise.
export default function protect(req, res, next) {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' })
  }

  const token = header.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (err) {
    res.status(401).json({ message: 'Not authorized, invalid or expired token' })
  }
}
