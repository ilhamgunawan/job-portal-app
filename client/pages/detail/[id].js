import {
  Container,
  Heading,
  Flex,
  Spinner,
  Tag,
  Card,
  Text,
  Button,
  Link
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';

export const getServerSideProps = async (context) => {
  if (context.params.id) {
    return {
      props: {
        id: context.params.id,
      },
    };
  } else {
    return {
      redirect: {
        destination: '/'
      }
    }
  }
};

export default function JobDetail({ id }) {
  const [state, setState] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function getJobDetail(id) {
      const endpoint = `http://localhost:3030/api/jobs/${id}`;
      return axios({
        url: endpoint,
        method: 'get',
        withCredentials: true,
      })
        .then(data => setState(data.data.data))
        .catch(e => setState(null));
    }

    getJobDetail(id);
  }, [id]);

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <Container>
      {!state ? 
        <Flex minH='100vh' alignItems='center' justifyContent='center'>
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </Flex>
        :
        <>
          <Head>
            <title>{state.title}</title>
          </Head>
          <Flex flexDirection='row' marginY={5}>
            <Button onClick={() => router.back()}>Back</Button>
          </Flex>
          <Card shadow='md' padding={3} marginY={5}>
            <Flex flexDirection='row' justifyContent='space-between' alignItems='flex-start'>
              <Flex flexDirection='column'>
                <Heading as='h1' fontSize='md'>{state.title}</Heading>
                <Text marginTop={3} fontWeight='semibold' fontSize='sm'>
                  {state.company}
                </Text>
                <Text marginTop={2} fontSize='sm'>
                  Location: <Tag>{state.location}</Tag>
                </Text>
                <Text marginTop={2} fontSize='sm'>
                  Website: <Link href={state.company_url} target='_blank'>{state.company_url}</Link>
                </Text>
              </Flex>
              <Tag colorScheme='green' minW='80px' textAlign='center'>{state.type}</Tag>
            </Flex>
          </Card>
          <Card shadow='md' padding={3} marginY={5}>
            <Heading as='h2' fontSize='md'>How to apply</Heading>
            <Flex marginTop={2}>
              <div style={{ width:'100%' }} dangerouslySetInnerHTML={{__html: state.how_to_apply}} />
            </Flex>
          </Card>
          <Card shadow='md' padding={3} marginY={5}>
            <Heading as='h2' fontSize='md'>Job Description</Heading>
            <Flex padding={6}>
              <div style={{ width:'100%' }} dangerouslySetInnerHTML={{__html: state.description}} />
            </Flex>
          </Card>
        </>
      }
    </Container>
  );
};
