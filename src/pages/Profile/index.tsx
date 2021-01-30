import React, { ChangeEvent, useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useToast } from '../../hooks/Toast';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErros';

import Button from '../../components/Button';
import Input from '../../components/Input';

import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/Auth';
interface ProfileFormDate {
  name: string;
  email: string;
  oldPassword: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormDate) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string().required('E-mail obrigatório').email(),
          oldPassword: Yup.string(),
          password: Yup.string().when('oldPassword', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório').min(6),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('oldPassword', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatório').min(6),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), ''], 'Confirmação incorreta'),
        });
        await schema.validate(data, { abortEarly: false });

        const {
          name,
          email,
          oldPassword,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(oldPassword
            ? {
                oldPassword,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        addToast({ title: 'Perfil atualizado', type: 'success' });
        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro na atualização!',
          description:
            'Ocorreu um erro ao atualizar o perfil, verifique os campos.',
        });
      }
    },
    [history, addToast, updateUser],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();
        data.append('avatar', e.target.files[0]);

        api.patch('/users/avatar', data).then(response => {
          addToast({
            type: 'success',
            title: 'Avatar atualizado!',
          });
          updateUser(response.data);
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>
          <h1>Meu Perfil</h1>
          <Input placeholder="Nome" name="name" icon={FiUser} />
          <Input placeholder="E-mail" name="email" icon={FiMail} />
          <Input
            containerStyle={{ marginTop: 24 }}
            type="password"
            icon={FiLock}
            placeholder="Senha atual"
            name="oldPassword"
          />
          <Input
            type="password"
            icon={FiLock}
            placeholder="Nova senha"
            name="password"
          />
          <Input
            type="password"
            icon={FiLock}
            placeholder="Confirmar senha"
            name="password_confirmation"
          />
          <Button type="submit">Atualizar</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
