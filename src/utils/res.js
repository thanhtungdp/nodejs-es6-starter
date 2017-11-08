export function resError (res, messageError) {
  res.json({ error: true, message: messageError })
}
