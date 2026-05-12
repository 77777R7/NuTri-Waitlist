
  # 一比一还原代码

  This is a code bundle for 一比一还原代码. The original project is available at https://www.figma.com/design/qNIvxWBhqzxRMGAvlJh5nH/%E4%B8%80%E6%AF%94%E4%B8%80%E8%BF%98%E5%8E%9F%E4%BB%A3%E7%A0%81.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Waitlist backend

  The custom waitlist form submits to `/api/waitlist`, a Vercel Function that
  adds subscribers to beehiiv without exposing the beehiiv API key in the
  browser.

  Required Vercel environment variables:

  - `BEEHIIV_API_KEY`
  - `BEEHIIV_PUBLICATION_ID`

  Optional environment variables:

  - `BEEHIIV_SEND_WELCOME_EMAIL=false`
  - `BEEHIIV_DOUBLE_OPT_OVERRIDE=` (`on`, `off`, or `not_set`)
  
