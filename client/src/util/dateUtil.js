export function calculateAge (birthday) {
  const today = new Date()
  const born = new Date(birthday)
  let age = today.getFullYear() - born.getFullYear()
  const monthDiff = today.getMonth() - born.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < born.getDate())) { age-- }
  return age
}
