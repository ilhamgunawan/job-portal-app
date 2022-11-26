import { useReducer, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  Container,
  Heading,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

const initialState = {
  type: 'Idle',
  username: '',
  password: '',
  data: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return state;
    case 'SUBMIT':
      return {
        ...state,
        type: 'Submit',
        username: action.payload.username,
        password: action.payload.password,
      };
    case 'SUCCESS':
      return {
        ...state,
        type: 'Success',
        data: action.payload.data,
      };
    case 'ERROR':
      return {
        ...state,
        type: 'Error',
      };
    default:
      return state;
  }
};

const onStateChange = async (state, dispatch, router) => {
  switch (state.type) {
    case 'Idle':
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') return router.replace('/');
      return;
    case 'Submit':
      return axios({
        url: 'http://localhost:3030/api/login',
        method: 'post',
        withCredentials: true,
        data: {
          username: state.username,
          password: state.password,
        },
      })
        .then(data => dispatch({ type: 'SUCCESS', payload: data.data }))
        .catch(e => dispatch({ type: 'ERROR' }));
    case 'Success':
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', state.username);
      return router.replace('/');
    case 'Error':
      return;
    default:
      return;
  }
};

export default function Login() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');
    const payload = { username, password };
    dispatch({ type: 'SUBMIT', payload });
  };

  useEffect(() => {
    onStateChange(state, dispatch, router);
  }, [state]);

  return (
    <Container minH='100vh' display='flex' alignItems='center' justifyContent='center'>
      <Box
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'lg'}
        p={8}
        w='100%'
      >
        <Heading textAlign='center' as='h1'>Sign in</Heading>
        <Stack spacing={4} as='form' onSubmit={onSubmit}>
          <FormControl id='username'>
            <FormLabel>Username</FormLabel>
            <Input
              type='text'
              name='username'
              isDisabled={state.type === 'Submit'}
              isRequired={true}
            />
          </FormControl>
          <FormControl id='password'>
            <FormLabel>Password</FormLabel>
            <Input
              type='password'
              name='password'
              isDisabled={state.type === 'Submit'}
              isRequired={true}
            />
          </FormControl>
          <Stack spacing={10}>
            <Button
              bg={'blue.400'}
              color={'white'}
              _hover={{ bg: 'blue.500' }}
              type='submit'
              isLoading={state.type === 'Submit'}
            >
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
