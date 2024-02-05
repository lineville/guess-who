import { Avatar, AvatarBadge, Badge, Box, VStack, Icon, HStack, Text } from "@chakra-ui/react";
import { BsFillPersonBadgeFill } from "react-icons/bs";

interface PlayerProps {
  character: string;
  isMyTurn: boolean;
  remainingCharacters: number;
  secret?: boolean;
}

const Player: React.FC<PlayerProps> = ({ character, isMyTurn, remainingCharacters, secret = true }) => (
  <Box marginLeft='0.5em' marginRight='0.5em'>
    <VStack>
      <Avatar name={!secret ? character : undefined} src={!secret && character ? `/${character}.png` : '/question-mark.png'} size="lg">
        <AvatarBadge boxSize='1.25em' bg={(isMyTurn && !secret) || (!isMyTurn && secret) ? 'green.500' : 'red.500'} />
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

export default Player;