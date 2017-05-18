require('es6-promise').polyfill()
require('isomorphic-fetch')

module.exports = (app) => {
  app.post('/reading', (req, res) => {
    const { GITHUB_ACCESS_TOKEN, ZENHUB_ACCESS_TOKEN } = req.webtaskContext.secrets
    const payload = JSON.parse(req.body.payload)
    const { url, html_url, number } = payload.issue
    console.info(`[BEGIN] issue updated with action: ${payload.action}`)
    if (payload.action === 'opened') {
      fetch(`${url}?access_token=${GITHUB_ACCESS_TOKEN}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          milestone: 1
        })
      })
        .then(() => console.info(`[END] set milestone successful! ${html_url}`))
        .catch(err => res.json(err))
    } else if (payload.action === 'milestoned') {
      fetch(`https://api.zenhub.io/p1/repositories/91649130/issues/${number}/estimate?access_token=${ZENHUB_ACCESS_TOKEN}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estimate: 1
        })
      })
        .then(() => console.info(`[END] set estimate successful! ${html_url}`))
        .catch(err => res.json(err))
    }

    res.json({ message: 'issue updated!' })
  })

  app.get('/reading', (req, res) => {
    const { GITHUB_ACCESS_TOKEN } = req.webtaskContext.secrets

    console.info('[BEGIN]', req.query)
    const title = req.query.title

    let keyword = encodeURIComponent(title.replace(/\s/g, '+'))
    console.info('[KEYWORD]', keyword)

    fetch(`https://api.github.com/search/issues?q=${keyword}%20repo:jimmylv/reading`)
      .then(response => response.json())
      .then(data => {
        console.info('[RESULT]', data)
        if (data.total_count > 0) {
          fetch(`${data.items[0].url}?access_token=${GITHUB_ACCESS_TOKEN}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              state: 'closed'
            })
          })
            .then(() => console.info(`[END] issue closed successful! ${data.items[0].html_url}`))
            .catch(err => res.json('error', { error: err }))
        }
        res.json({ error: 'Not Found!' })
      })
      .catch(err => res.json('error', { error: err }))
  })
}
