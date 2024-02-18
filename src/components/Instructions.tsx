import {
  ArrowRightIcon,
  ChatIcon,
  CheckCircleIcon,
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
} from "@chakra-ui/react";
import styles from "../styles/styles.module.css";

export default function Instructions(): JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Card bottom={isMobile ? '2vh' : '25vh'}>
      <CardHeader>
        <Heading size={isMobile ? "md" : "xl"}>How it works</Heading>
      </CardHeader>
      <CardBody>
        <List className="how-to">
          <ListItem mb={3}>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <strong className={styles["how-to-header"]}>Goal</strong>
            <Code ml={2}>
              {
                "Guess your opponent's secret character before they guess who you are."
              }
            </Code>
          </ListItem>
          <ListItem mb={3}>
            <ListIcon as={ArrowRightIcon} />
            <strong className={styles["how-to-header"]}>Start Up</strong>
            <Code ml={2}>
              {"Copy the invite link in the game room and send it to a friend."}
            </Code>
          </ListItem>
          <ListItem mb={3}>
            <ListIcon as={RepeatIcon} color="blue.500" />
            <strong className={styles["how-to-header"]}>Playing</strong>
            <Code ml={2}>
              {
                "You and your opponent take turns asking and answering questions."
              }
            </Code>
          </ListItem>
          <ListItem mb={3}>
            <ListIcon as={ChatIcon} color="green.500" />
            <strong className={styles["how-to-header"]}>Your Turn</strong>
            <Code ml={2}>
              {
                "Answer your opponent's question, then ask your opponent a question about their secret character."
              }
            </Code>
          </ListItem>
          <ListItem mb={3}>
            <ListIcon as={SpinnerIcon} />
            <strong className={styles["how-to-header"]}>Their Turn</strong>
            <Code ml={2}>
              {
                "Eliminate characters on your board while your opponent thinks of their next question."
              }
            </Code>
          </ListItem>
          <ListItem mb={3}>
            <ListIcon as={StarIcon} color="yellow.500" />
            <strong className={styles["how-to-header"]}>Winning</strong>
            <Code ml={2}>
              {"Guess your opponent's secret character correctly!"}
            </Code>
          </ListItem>
        </List>
      </CardBody>
    </Card>
  );
}
