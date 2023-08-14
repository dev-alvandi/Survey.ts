export default function emailHtmlTemplate(link: string) {
  return `
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <!-- partial:index.partial.html -->
        <div
          style="
            font-family: Helvetica, Arial, sans-serif;
            width: 100%;
            margin: auto;
            overflow: auto;
            line-height: 2;
          ">
          <div style="margin: 50px auto; width: 70%; padding: 20px 0">
            <div style="border-bottom: 1px solid #eee">
              <a
                href=""
                style="
                  font-size: 1.4em;
                  color: #00466a;
                  text-decoration: none;
                  font-weight: 600;
                "
                >Survey Webpage</a
              >
            </div>
            <p style="font-size: 1.1em">Hi,</p>
            <p>
              Thank you for choosing Survey. Use the following OTP to complete your
              Password Recovery Procedure. OTP is valid for an hour.
            </p>
            <h2>
              <a
                style="
                  background-color: #00466a;
                  padding: 0.5rem 0.75rem;
                  border-radius: 0.375rem;
                  border-radius: 4px;
                  color: #eee;
                  text-decoration: none;
                "
                href=${link}
                >Click here</a
              >
            </h2>
            <p style="font-size: 0.9em">Regards,<br />Mohammad Ghiasvand</p>
          </div>
        </div>
        <!-- partial -->
      </body>
    </html>
  `;
}
