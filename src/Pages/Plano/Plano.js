import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../Styles/MeuPlanoStyles';

const Plano = () => {
		return (
			<View style={styles.container}>
				{/* Fundo diagonal */}
				<View style={styles.diagonalBg} />
				{/* Header */}
				<View style={styles.header}>
				<TouchableOpacity style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color="#222" />
				</TouchableOpacity>
				<Text style={styles.title}>Meu plano</Text>
				<TouchableOpacity style={styles.menuButton}>
					<Ionicons name="menu" size={28} color="#222" />
				</TouchableOpacity>
			</View>

			{/* Conteúdo principal */}
			<ScrollView contentContainerStyle={styles.scrollContent}>
				{/* Card do plano */}
								<View style={styles.cardPlano}>
									<Text style={styles.planoAtivo}>Plano ativo</Text>
							<Text style={styles.nomePlano}>Essencial</Text>
							<View style={styles.beneficiosList}>
								<View style={styles.beneficioItem}>
									<Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
									<Text style={styles.beneficioText}>Funcional</Text>
								</View>
								<View style={styles.beneficioItem}>
									<Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
									<Text style={styles.beneficioText}>Thay Fit</Text>
								</View>
								<View style={styles.beneficioItem}>
									<Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
									<Text style={styles.beneficioText}>Pilates</Text>
								</View>
							</View>
						</View>

				{/* Informações do plano */}
				<View style={styles.infoRow}>
					<View style={styles.infoBox}>
						<Text style={styles.infoLabel}>Início:</Text>
						<Text style={styles.infoValue}>25/09/2025</Text>
					</View>
					<View style={styles.infoBox}>
						<Text style={styles.infoLabel}>Vencimento:</Text>
						<Text style={styles.infoValue}>25/10/2025</Text>
					</View>
				</View>
				<View style={styles.infoRow}>
					<View style={styles.infoBox}>
						<Text style={styles.infoLabel}>Valor do plano:</Text>
						<Text style={styles.infoValue}>R$159,90</Text>
					</View>
					<View style={styles.infoBox}>
						<Text style={styles.infoLabel}>Duração:</Text>
						<Text style={styles.infoValue}>2 meses</Text>
					</View>
				</View>

				{/* Botão de renovar */}
				<TouchableOpacity style={styles.renovarButton}>
					<Text style={styles.renovarButtonText}>Renovar Plano</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};

export default Plano;
