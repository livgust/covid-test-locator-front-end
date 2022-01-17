import React, {useState} from 'react';
//import Button from '@mui/material/Button';
import Dialog, {DialogProps} from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function ButtonAppBar() {
  const [anchorEl, setAnchorEl] = useState<Element | null | undefined>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <>
      {/* <Button
        href="https://www.gofundme.com/f/wwwmacovidvaccinescom?utm_source=customer&utm_medium=copy_link&utm_campaign=p_cf+share-flow-1"
        target="_blank"
        rel="noreferrer"
        variant="text"
        sx={{color: 'secondary.contrastText', pr: 3}}
      >
        Contribute
      </Button> */}
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={event => setAnchorEl(event.target as Element)}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setAboutOpen(true);
          }}
        >
          About
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setResourcesOpen(true);
          }}
        >
          Resources
        </MenuItem>
        <MenuItem>
          <a
            href={
              'mailto:olivia@oliviaadams.dev?subject=covidtestcollab.com feedback'
            }
          >
            Feedback
          </a>
        </MenuItem>
      </Menu>
      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <ResourcesDialog
        open={resourcesOpen}
        onClose={() => setResourcesOpen(false)}
      />
    </>
  );
}

function AboutDialog(props: DialogProps) {
  return (
    <Dialog {...props}>
      <DialogTitle id="about-dialog-title">About</DialogTitle>
      <DialogContent>
        <DialogContentText id="about-dialog-description" component="div">
          <p>
            This website was created by{' '}
            <a
              href="http://www.oliviaadams.dev"
              target="_blank"
              rel="noreferrer"
            >
              Olivia Adams
            </a>
            .
          </p>
          <p>
            This website allows users to report the availability of COVID tests
            across the world. covidtestcollab.com does not verify any reports
            here - it is 100% crowd-sourced. We are not affiliated with any
            government agency. We do not sell any information we gather, nor do
            we distribute it outside of anyone working on this website. By using
            this website, you must allow location access so we can tailor the
            results and search to where you are.
          </p>
          <h3>Get Involved</h3>
          <p>
            If you have experience with designing or developing web site
            software and you want to get involved in the site, please{' '}
            <a
              href={
                'mailto:olivia@oliviaadams.dev?subject=I want to help with covidtestcollab.com'
              }
              target="_blank"
              rel="noreferrer"
            >
              email me
            </a>
            at olivia@oliviaadams.dev.
          </p>
          <p>
            The website source code can be found on Github. The server-side code
            is in the{' '}
            <a
              href={'https://github.com/livgust/covid-test-locator-back-end'}
              target="_blank"
              rel="noreferrer"
            >
              covid-test-locator-back-end
            </a>{' '}
            repository. The code that generates the website is in the{' '}
            <a
              href={'https://github.com/livgust/covid-test-locator-front-end'}
              target="_blank"
              rel="noreferrer"
            >
              covid-test-locator-front-end
            </a>{' '}
            repository.
          </p>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

function ResourcesDialog(props: DialogProps) {
  return (
    <Dialog {...props}>
      <DialogTitle id="about-dialog-title">Resources</DialogTitle>
      <DialogContent>
        <DialogContentText id="about-dialog-description" component="div">
          <p>Other Sites</p>
          <ul>
            <li>
              <a
                href="https://findacovidtest.org"
                target="_blank"
                rel="noreferrer"
              >
                findacovidtest.org
              </a>{' '}
              (volunteer-run - find Covid tests available to purchase online)
            </li>
          </ul>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
