import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState('Resgatante');
  const [loading, setLoading] = useState(false);

  const tiposPessoa = ['Resgatante', 'Denunciante', 'Adotante'];

  const formatCPF = (value) => {
    const numericValue = value.replace(/\D/g, '');
    let formatted = numericValue;

    if (numericValue.length > 3 && numericValue.length <= 6) {
      formatted = numericValue.replace(/(\d{3})(\d+)/, '$1.$2');
    } else if (numericValue.length > 6 && numericValue.length <= 9) {
      formatted = numericValue.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else if (numericValue.length > 9) {
      formatted = numericValue.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    }

    return formatted;
  };

  const formatPhone = (value) => {
    const numericValue = value.replace(/\D/g, '');

    if (numericValue.length > 10) {
      return numericValue.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (numericValue.length > 5) {
      return numericValue.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (numericValue.length > 2) {
      return numericValue.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else {
      return numericValue.replace(/^(\d*)/, '($1');
    }
  };

  const validateCPF = (cpf) => {
    const strCPF = cpf.replace(/[^\d]+/g, '');

    if (strCPF.length !== 11) return false;

    let sum = 0;
    let remainder;

    if (/^(\d)\1+$/.test(strCPF)) return false;

    for (let i = 1; i <= 9; i++)
      sum += parseInt(strCPF.substring(i - 1, i)) * (11 - i);

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(strCPF.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++)
      sum += parseInt(strCPF.substring(i - 1, i)) * (12 - i);

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(strCPF.substring(10, 11))) return false;

    return true;
  };

  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const numericPhone = phone.replace(/\D/g, '');
    return numericPhone.length >= 10 && numericPhone.length <= 11;
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleRegister = async () => {
    // Validações
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o nome');
      return;
    }
    if (!telefone.trim() || !validatePhone(telefone)) {
      Alert.alert('Erro', 'Por favor, preencha um telefone válido');
      return;
    }
    if (!cpf.trim() || !validateCPF(cpf)) {
      Alert.alert('Erro', 'Por favor, preencha um CPF válido');
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      Alert.alert('Erro', 'Por favor, preencha um email válido');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      
      const userData = {
        nome: name,
        cpf: cpf.replace(/\D/g, ''), 
        telefone: telefone.replace(/\D/g, ''),
        tipoPessoa: tipoPessoa,
        email: email,
        role: "ADMIN",
        senha: password
      };

      const response = await api.post('/pessoa', userData);
      
      if (response.status === 201) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      
      let errorMessage = 'Erro ao realizar cadastro';
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'Este CPF ou e-mail já está cadastrado';
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/image.png')}
      style={styles.background}
      imageStyle={{ opacity: 0.3 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#7a64d9" />
          <Text style={[styles.backText, { color: '#7a64d9' }]}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Seja bem-vindo!</Text>
        <Text style={styles.subtitle}>Crie seu cadastro para continuar</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        
        <Text style={styles.inputLabel}>Tipo de Pessoa:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipoPessoa}
            onValueChange={(itemValue) => setTipoPessoa(itemValue)}
            style={styles.picker}
          >
            {tiposPessoa.map((tipo, index) => (
              <Picker.Item key={index} label={tipo} value={tipo} />
            ))}
          </Picker>
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={telefone}
          onChangeText={(text) => setTelefone(formatPhone(text))}
          keyboardType="phone-pad"
          maxLength={15}
        />
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={cpf}
          onChangeText={(text) => setCpf(formatCPF(text))}
          keyboardType="numeric"
          maxLength={14}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Campo senha */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={24}
              color="#7a64d9"
            />
          </TouchableOpacity>
        </View>

        {/* Campo confirmar senha */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Confirme a senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? 'eye' : 'eye-off'}
              size={24}
              color="#7a64d9"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Já tem conta? Faça login</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    marginLeft: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#5a4e9c',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#4b3ca7',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5a4e9c',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#5a4e9c',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  eyeButton: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  button: {
    backgroundColor: '#7a64d9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonDisabled: {
    backgroundColor: '#b0a4e8',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    color: '#7a64d9',
    textDecorationLine: 'underline',
  },
});