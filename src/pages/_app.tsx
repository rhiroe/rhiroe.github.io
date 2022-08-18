import '~/styles/globals.css'
import type { AppProps } from 'next/app'
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import Container from '@mui/material/Container';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';

function MyApp({ Component, pageProps }: AppProps) {
  return(
      <>
          <AppBar position="static">
              <Toolbar>
                  <a href="https://github.com/rhiroe">
                      <Avatar sx={{ mr: 2 }} alt="rhiroe" src="/rhiroe_icon.jpg" />
                  </a>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      {'Ryosuke "Rio" Hiroe'}
                  </Typography>
                  <Fab
                      size="small"
                      sx={{ mr: 1 }}
                      aria-label="email"
                      href="mailto:ride.poke@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                  >
                      <EmailIcon />
                  </Fab>
                  <Fab
                      size="small"
                      sx={{ mr: 1 }}
                      aria-label="github"
                      href="https://github.com/rhiroe"
                      target="_blank"
                      rel="noopener noreferrer"
                  >
                      <GitHubIcon />
                  </Fab>
                  <Fab
                      size="small"
                      sx={{ mr: 1 }}
                      aria-label="twitter"
                      href="https://twitter.com/messages/compose?recipient_id=509745934"
                      target="_blank"
                      rel="noopener noreferrer"
                  >
                      <TwitterIcon />
                  </Fab>
              </Toolbar>
          </AppBar>
          <Container maxWidth="md">
              <Component {...pageProps} />
          </Container>
          <footer className="footer">
              <div className="row">
                  © 2022 rhiroe
              </div>
          </footer>
      </>
  )
}

export default MyApp
