import { 
  Card, 
  Image, 
  Stack, 
  CardBody,
  // CardFooter,
  // Button,
  Heading, 
  Text,
  Tag,
  Flex
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import Link from 'next/link';
import relativeTime from 'dayjs/plugin/relativeTime';

export default function JobCard({ id, title,  company, thumbnailURL, location, type, createdAt }) {
  dayjs.extend(relativeTime);
  const time = dayjs(createdAt).fromNow();

  return (
    <Link href={`/detail/${id}`} passHref>
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow='hidden'
        variant='outline'
        marginBottom={5}
        shadow='md'
        border='none'
      >
        <Stack w='100%'>
          <CardBody w='100%'>
            <Flex flexDirection='row' justifyContent='space-between' alignItems='flex-start'>
              <Heading size='md'>{title}</Heading>
              <Tag colorScheme='green' minW='80px' textAlign='center'>{type}</Tag>
            </Flex>
            <Text marginTop={2}>{company}</Text>
            <Text>Location: {location}</Text>
            <Text>{time}</Text>
          </CardBody>
        </Stack>
      </Card>
    </Link>
  );
};
