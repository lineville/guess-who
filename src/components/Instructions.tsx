import {
  ArrowRightIcon,
  ChatIcon,
  CheckCircleIcon,
  InfoOutlineIcon,
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
  Kbd,
  Box,
} from "@chakra-ui/react";
import { HeartFillIcon, MarkGithubIcon } from "@primer/octicons-react";
import styles from "../styles/styles.module.css";
import NextLink from "next/link";

interface InstructionsProps {
  variant?: string;
}

export default function Instructions({
  variant = "elevated",
}: InstructionsProps): JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      ml={isMobile ? 2 : 0}
      mr={isMobile ? 2 : 0}
      flex={1}
      overflowY={"auto"}
      mb={4}
    >
      <Card variant={variant}>
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
                {
                  "Copy the invite link in the game room and send it to a friend."
                }
              </Code>
            </ListItem>
            <ListItem mb={3}>
              <ListIcon as={RepeatIcon} color="blue.500" />
              <strong className={styles["how-to-header"]}>Playing</strong>
              <Code ml={isMobile ? 0 : 2} mt={isMobile ? 2 : 0}>
                {
                  "Take turns asking and answering questions to uncover each others secret characters."
                }
              </Code>
            </ListItem>
            <ListItem mb={3}>
              <ListIcon as={SpinnerIcon} />
              <strong className={styles["how-to-header"]}>Their Turn</strong>
              <Code ml={isMobile ? 0 : 2} mt={isMobile ? 2 : 0}>
                {
                  "Eliminate characters from your board while your opponent crafts their next question."
                }
              </Code>
            </ListItem>
          </List>
        </CardBody>
        <Divider />
        <CardFooter
          display={"flex"}
          justifyContent={"flex-end"}
          alignItems={"flex-end"}
        >
          <ButtonGroup gap={3}>
            <Link as={NextLink} href="https://github.com/sponsors/lineville">
              <Button colorScheme="pink" leftIcon={<HeartFillIcon />}>
                Donate
              </Button>
            </Link>
            <Link as={NextLink} href="https://github.com/lineville/guess-who">
              <Button colorScheme={"blackAlpha"} leftIcon={<MarkGithubIcon />}>
                Source Code
              </Button>
            </Link>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </Box>
  );
}
