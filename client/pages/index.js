import Head from 'next/head';
import { useReducer, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { 
  Container, 
  Heading, 
  Button,
  Card,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Flex,
  Text,
  Spinner
} from '@chakra-ui/react';
import JobCard from '../components/JobCard';

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return state;
    case 'FETCH_JOBS':
      return {
        ...state,
        type: 'Fetching',
        description: action.payload.description ?? null,
        location: action.payload.location ?? null,
        fullTime: action.payload.fullTime,
        page: 1,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        type: 'FetchingSuccess',
        data: action.payload.data,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        type: 'FetchingError',
      };
    case 'FETCH_MORE':
      return {
        ...state,
        type: 'FetchingMore',
        description: action.payload.description ?? null,
        location: action.payload.location ?? null,
        fullTime: action.payload.fullTime,
        page: state.page + 1,
      };
    case 'FETCH_MORE_SUCCESS':
      return {
        ...state,
        type: 'FetchingMoreSuccess',
        data: [
          ...state.data,
          ...action.payload.data,
        ],
      };
    default:
      return state;
  };
};

const onStateChange = (state, dispatch, router) => {
  switch (state.type) {
    case 'Idle':
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (!isLoggedIn) {
        localStorage.removeItem('username');
        return router.replace('/auth/login');
      }
      return dispatch({ 
        type: 'FETCH_JOBS',
        payload: {
          description: state.description,
          location: state.location,
          fullTime: state.fullTime,
          page: 1,
        },
      });
    case 'Fetching': {
      const search = new URLSearchParams();
      if (state.description) search.append('description', state.description);
      if (state.location) search.append('location', state.location);
      if (state.fullTime) search.append('full_time', 'true');
      search.append('page', state.page.toString());
      const endpoint = `http://localhost:3030/api/jobs?${search.toString()}`;

      return axios({
        url: endpoint,
        method: 'get',
        withCredentials: true,
      })
        .then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data.data }))
        .catch(e => dispatch({ type: 'FETCH_ERROR' }));
    }
    case 'FetchingMore': {
      const search = new URLSearchParams();
      if (state.description) search.append('description', state.description);
      if (state.location) search.append('location', state.location);
      if (state.fullTime) search.append('full_time', 'true');
      search.append('page', state.page.toString());
      const endpoint = `http://localhost:3030/api/jobs?${search.toString()}`;

      return axios({
        url: endpoint,
        method: 'get',
        withCredentials: true,
      })
        .then(data => dispatch({ type: 'FETCH_MORE_SUCCESS', payload: data.data }))
        .catch(e => dispatch({ type: 'FETCH_ERROR' }));
    }
    case 'FetchingSuccess':
      return;
    case 'FetchingError':
      return;
    default:
      return;
  }
};

export const getServerSideProps = async (context) => {
  return {
    props: {
      description: context.query.description ? context.query.description : null,
      location: context.query.location ? context.query.location : null,
      fullTime: context.query.full_time ? true : false,
      page: context.query.page ? Number(context.query.page) : 1,
    },
  };
};

export default function Home({ description, location, fullTime, page }) {
  const router = useRouter();
  const initialState = {
    type: 'Idle',
    description: description ? description : null,
    location: location ? location : null,
    fullTime: fullTime,
    page,
    data: [],
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const data = state.data.length !== 0
    ? state.data.filter(job => job !== null)
    : [];
  
  const onSubmitSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const description = formData.get('description');
    const location = formData.get('location');
    const fullTime = formData.get('fulltime');
    const search = new URLSearchParams();
    if (description !== '') search.append('description', description);
    if (location !== '') search.append('location', location);
    if (fullTime !== null) search.append('full_time', 'true');
    router.push(`/?${search.toString()}`);
    return dispatch({ 
      type: 'FETCH_JOBS',
      payload: {
        description: description !== '' ? description : null,
        location: location !== '' ? location : null,
        fullTime: fullTime !== null ? true : false,
        page: 1,
      },
    });
  };

  const onShowMore = () => {
    dispatch({ 
      type: 'FETCH_MORE',
      payload: {
        description: description !== '' ? description : null,
        location: location !== '' ? location : null,
        fullTime: fullTime !== null ? true : false,
      }
    });
  };

  useEffect(() => {
    onStateChange(state, dispatch, router);
  }, [state]);

  return (
    <Container>
      <Head>
        <title>Job Portal</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Heading marginY={5}>Job Portal</Heading>
      <Card
        w='100%'
        marginBottom={5}
        shadow='md'
        padding={4}
        as='form'
        onSubmit={onSubmitSearch}
      >
        <Flex flexDirection='row' alignItems='flex-end' >
          <FormControl id='description' marginRight={2}>
            <FormLabel fontSize='sm'>Job description</FormLabel>
            <Input
              type='text'
              name='description'
              placeholder='Filter by job title'
              defaultValue={description ? description : ''}
            />
          </FormControl>
          <FormControl id='location'>
            <FormLabel fontSize='sm'>Location</FormLabel>
            <Input
              type='text'
              name='location'
              placeholder='Filter by location'
              defaultValue={location ? location : ''}
            />
          </FormControl>
        </Flex>
        <FormControl id='fulltime' marginY={3}>
          <Checkbox 
            name='fulltime'
            defaultChecked={fullTime}
          >
            <Text fontSize='sm'>Full time</Text>
          </Checkbox>
        </FormControl>
        <Stack spacing={10}>
          <Button
            bg={'blue.400'}
            color={'white'}
            _hover={{ bg: 'blue.500' }}
            type='submit'
            w='150px'
          >
            Search
          </Button>
        </Stack>
      </Card>
      {data.map((job, index) => 
        <JobCard 
          key={job.id}
          id={job.id}
          title={job.title}
          company={job.company}
          thumbnailURL={job.company_logo}
          location={job.location}
          type={job.type}
          createdAt={job.created_at}
        />
      )}
      {state.type === 'Fetching'
        ? <Flex justifyContent='center'>
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />
          </Flex>
        : null
      }
      {data.length === 0 && state.type === 'FetchingSuccess'
        ? <Text>No jobs found.</Text>
        : null
      }
      {data.length > 0 
        ? <Button marginBottom={5} onClick={() => onShowMore()}>Show more</Button>
        : null
      }
    </Container>
  );
};
