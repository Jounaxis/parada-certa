import { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';

import { AzulCivicoButton } from '../../components/AzulCivicoAction';
import { AzulCivicoField } from '../../components/AzulCivicoField';
import { colors, spacing, typography } from '../../styles/azulCivico';

const needs = [
  { value: 'CADEIRA_DE_RODAS', label: 'Cadeira de rodas' },
  { value: 'BAIXA_VISAO', label: 'Baixa visão' },
  { value: 'MOBILIDADE_REDUZIDA', label: 'Mobilidade reduzida' },
  { value: 'IDOSO', label: 'Idoso' },
] as const;

type Need = (typeof needs)[number]['value'];
type Validation = 'idle' | 'invalid' | 'valid';

export function PassengerForm() {
  const [name, setName] = useState('');
  const [need, setNeed] = useState<Need | null>(null);
  const [emergencyContact, setEmergencyContact] = useState('');
  const [validation, setValidation] = useState<Validation>('idle');

  const nameError = name.trim() ? undefined : 'Informe o nome do passageiro.';
  const needError = need ? undefined : 'Selecione o tipo de necessidade.';
  const contactError = emergencyContact.trim() ? undefined : 'Informe o contato de emergência.';
  const showErrors = validation === 'invalid';

  function clearValidFeedback() {
    setValidation((current) => (current === 'valid' ? 'idle' : current));
  }

  function validate() {
    if (nameError || needError || contactError) {
      setValidation('invalid');
      return;
    }

    Keyboard.dismiss();
    setValidation('valid');
  }

  return (
    <View style={styles.form}>
      <Text style={styles.body}>Use dados fictícios para testar este formulário.</Text>
      <AzulCivicoField
        label="Nome do passageiro"
        autoCapitalize="words"
        maxLength={120}
        value={name}
        onChangeText={(value) => {
          setName(value);
          clearValidFeedback();
        }}
        error={showErrors ? nameError : undefined}
      />
      <View style={styles.needGroup}>
        <Text style={styles.label}>Tipo de necessidade</Text>
        <View accessibilityRole="radiogroup" style={styles.options}>
          {needs.map(({ value, label }) => {
            const checked = need === value;

            return (
              <Pressable
                key={value}
                accessibilityLabel={label}
                accessibilityRole="radio"
                accessibilityState={{ checked }}
                onPress={() => {
                  setNeed(value);
                  clearValidFeedback();
                }}
                style={({ pressed }) => [
                  styles.option,
                  checked && styles.selectedOption,
                  pressed && styles.pressedOption,
                ]}
              >
                <View accessible={false} style={[styles.radio, checked && styles.selectedRadio]}>
                  {checked && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.optionLabel}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
        {showErrors && needError && (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
            {needError}
          </Text>
        )}
      </View>
      <AzulCivicoField
        label="Contato de emergência"
        keyboardType="phone-pad"
        maxLength={40}
        value={emergencyContact}
        onChangeText={(value) => {
          setEmergencyContact(value);
          clearValidFeedback();
        }}
        error={showErrors ? contactError : undefined}
      />
      <Text style={styles.note}>
        O cadastro definitivo também exigirá a leitura e o aceite do termo de consentimento.
      </Text>
      <AzulCivicoButton label="Verificar campos" onPress={validate} />
      {validation === 'valid' && (
        <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.body}>
          Campos validados. A gravação depende da integração com a API.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.controlGap,
  },
  needGroup: {
    gap: 8,
  },
  options: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.controlGap,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.field,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  pressedOption: {
    opacity: 0.86,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.control,
    color: colors.text,
  },
  optionLabel: {
    ...typography.body,
    flexShrink: 1,
    color: colors.text,
  },
  body: {
    ...typography.body,
    color: colors.text,
  },
  note: {
    ...typography.message,
    color: colors.text,
  },
  error: {
    ...typography.message,
    color: colors.error,
  },
});
