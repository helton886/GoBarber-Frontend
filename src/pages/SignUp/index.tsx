import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useToast } from '../../hooks/Toast';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErros';

import logoImg from '../../assets/logo.svg';

import Button from '../../components/Button';
import Input from '../../components/Input';

import { Container, Content, Background, AnimationContainer } from './styles';
interface SignUpFormDate {
  name: string;
  password: string;
  email: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignUpFormDate) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string().required('E-mail obrigatório').email(),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
        });
        await schema.validate(data, { abortEarly: false });

        await api.post('/users', data);

        addToast({ title: 'Cadastro realizado"', type: 'success' });
        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro na criação da conta!',
          description: 'Ocorreu um erro ao criar a conta, verifique os campos.',
        });
      }
    },
    [history, addToast],
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>
            <Input placeholder="Nome" name="name" icon={FiUser} />
            <Input placeholder="E-mail" name="email" icon={FiMail} />
            <Input
              type="password"
              icon={FiLock}
              placeholder="Senha"
              name="password"
            />
            <Button type="submit">Cadastrar</Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Voltar para Logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
