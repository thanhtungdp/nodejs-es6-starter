export function resError (res, messageError, custom = {}) {
  res.json({ error: true, message: messageError, ...custom })
}
