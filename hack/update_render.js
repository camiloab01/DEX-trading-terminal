const headers = {
  accept: 'application/json',
  authorization: `Bearer ${process.env.RENDER_AUTH_TOKEN}`,
  'content-type': 'application/json',
}
const renderService = process.env.RENDER_SERVICE_ID
const fromKey = process.env.RENDER_ENV_KEY
const toVal = process.env.RENDER_ENV_VALUE

const getVars = async () => {
  const resp = await fetch(`https://api.render.com/v1/services/${renderService}/env-vars`, {
    headers,
  }).then((x) => x.json())
  if (!(resp.length && resp.length >= 6)) {
    throw 'too short response from api'
  }
  const vars = Object.fromEntries(
    resp.map((x) => {
      return [x.envVar.key, x.envVar.value]
    })
  )
  return vars
}

const main = async () => {
  const vars = await getVars()
  vars[fromKey] = toVal
  const pending = Object.entries(vars).map((x) => {
    return { key: x[0], value: x[1] }
  })
  await fetch(`https://api.render.com/v1/services/${renderService}/env-vars`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(pending),
  })

  console.log(`updated env var ${fromKey}=${toVal}`)
  console.log(`now redeploy`)
  await fetch(`https://api.render.com/v1/services/${renderService}/deploys`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({}),
  })
  console.log(`finish redeploy`)
}
main().catch(console.error)
