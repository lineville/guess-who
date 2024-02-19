import {
  ArrowRightIcon,
  ChatIcon,
  CheckCircleIcon,
  MoonIcon,
  RepeatIcon,
  SpinnerIcon,
  StarIcon,
} from "@chakra-ui/icons";
import {
  Code,
  Heading,
  List,
  ListIcon,
  ListItem,
  Card,
  CardHeader,
  CardBody,
  useBreakpointValue,
  Divider,
  CardFooter,
  Button,
  Link,
  ButtonGroup,
  useColorMode,
} from "@chakra-ui/react";
import { HeartFillIcon, MarkGithubIcon } from "@primer/octicons-react";
import styles from "../styles/styles.module.css";
import NextLink from "next/link";

export default function Instructions(): JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { colorMode } = useColorMode();

  return (
    <Card>
      <CardHeader p={isMobile ? 5 : 10}>
        <Heading size={isMobile ? "md" : "xl"}>How it works</Heading>
      </CardHeader>
      <Divider />
      <CardBody>
        <List className="how-to">
          <ListItem mb={3}>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <strong className={styles["how-to-header"]}>Goal</strong>
            <Code ml={isMobile ? 0 : 2} mt={isMobile ? 2 : 0}>
              {
                "Guess your opponent's secret character before they guess who you are."
              }
            </Code>
          </ListItem>
          <ListItem mb={3}>
            <ListIcon as={ArrowRightIcon} />
            <strong className={styles["how-to-header"]}>Start Up</strong>
            <Code ml={isMobile ? 0 : 2} mt={isMobile ? 2 : 0}>
              {"Copy the invite link in the game room and send it to a friend."}
            </Code>
          </ListItem>
          <ListItem mb={3}>
            <ListIcon as={RepeatIcon} color="blue.500" />
            <strong className={styles["how-to-header"]}>Playing</strong>
            <Code ml={isMobile ? 0 : 2} mt={isMobile ? 2 : 0}>
              {
                "You and your opponent take turns asking and answering questions."
              }
            </Code>
          </ListItem>
          <ListItem mb={3}>
            <ListIcon as={ChatIcon} color="green.500" />
            <strong className={styles["how-to-header"]}>Your Turn</strong>
            <Code ml={isMobile ? 0 : 2} mt={isMobile ? 2 : 0}>
              {
                "Answer your opponent's question, then ask your opponent a question about their secret character."
              }
            </Code>
          </ListItem>
          <ListItem mb={3}>
            <ListIcon as={SpinnerIcon} />
            <strong className={styles["how-to-header"]}>Their Turn</strong>
            <Code ml={isMobile ? 0 : 2} mt={isMobile ? 2 : 0}>
              {
                "Eliminate characters on your board while your opponent thinks of their next question."
              }
            </Code>
          </ListItem>
          <ListItem mb={3}>
            <ListIcon as={StarIcon} color="yellow.500" />
            <strong className={styles["how-to-header"]}>Winning</strong>
            <Code ml={isMobile ? 0 : 2} mt={isMobile ? 2 : 0}>
              {"Guess your opponent's secret character correctly!"}
            </Code>
          </ListItem>
          <ListItem mb={3}>
            <ListIcon as={MoonIcon} color="black.500" />
            <strong className={styles["how-to-header"]}>Theme</strong>
            <Code ml={isMobile ? 0 : 2} mt={isMobile ? 2 : 0}>
              {
                "Toggle dark and light mode by clicking the button in the top right."
              }
            </Code>
          </ListItem>
          <ListItem mb={3}>
            <ListIcon as={HeartFillIcon} color="red.500" />
            <strong className={styles["how-to-header"]}>Donate</strong>
            <Code ml={isMobile ? 0 : 2} mt={isMobile ? 2 : 0}>
              {"Support this project by sponsoring me on GitHub"}
            </Code>
          </ListItem>
        </List>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup display={"flex"} alignItems={"flex-end"}>
          <Link as={NextLink} href="https://github.com/sponsors/lineville">
            <Button colorScheme="pink" leftIcon={<HeartFillIcon />}>
              Donate
            </Button>
          </Link>
          <Link as={NextLink} href="https://github.com/lineville/guess-who">
            <Button colorScheme={colorMode === 'light' ? "blackAlpha" : "whiteAlpha"} leftIcon={<MarkGithubIcon />}>
              GitHub
            </Button>
          </Link>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
