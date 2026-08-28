export function authorizeModification(req, res, next) {
  const userId = req.user.id ?? req.user.userId;
  const role = req.user.role;
  const targetUserId = req.params.userId;

  if (role === "parent" || (role === "child" && String(userId) === String(targetUserId))) {
    return next();
  }

  return res.status(403).json({ error: "Access denied" });
}