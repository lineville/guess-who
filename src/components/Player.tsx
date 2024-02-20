import {
  Avatar,
  AvatarBadge,
  Badge,
  Box,
  VStack,
  Icon,
  HStack,
  Text,
} from "@chakra-ui/react";
import { BsFillPersonBadgeFill } from "react-icons/bs";

interface PlayerProps {
  character: string;
  isMyTurn: boolean;
  remainingCharacters: number;
  secret?: boolean;
}

export default function Player({
  character,
  isMyTurn,
  remainingCharacters,
  secret = true,
}: PlayerProps): JSX.Element {
  return (
    <Box marginLeft="0.5em" marginRight="0.5em">
      <VStack>
        <Avatar
          name={!secret ? character : undefined}
          src={
            !secret && character
              ? `/characters/${character}.png`
              : "/question-mark.png"
          }
          w={["40px", "60px"]}
          h={["40px", "60px"]}
        >
          <AvatarBadge
            boxSize="1.25em"
            bg={
              (isMyTurn && !secret) || (!isMyTurn && secret)
                ? "green.500"
                : "red.500"
            }
          />
        </Avatar>
        <Badge colorScheme="green">
          <HStack>
            <Icon as={BsFillPersonBadgeFill} />
            <Text>{remainingCharacters}</Text>
          </HStack>
        </Badge>
      </VStack>
    </Box>
  );
}
