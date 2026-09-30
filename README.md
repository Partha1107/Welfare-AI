# Welfare-AI

## Natural Tamil voice replies

Welfare AI prefers generated Tamil speech for clear, natural Tamil Nadu pronunciation. To enable it, copy `server/.env.example` to `server/.env`, add your `OPENAI_API_KEY`, then restart the server. The key stays on the server and is not sent to the browser.

If no key is configured, the site uses an installed Tamil browser voice when available. It will not read Tamil replies with an unrelated English voice.