package com.example.canchasapp.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Sports
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.canchasapp.ui.theme.PrimaryBlue
import com.example.canchasapp.ui.theme.SecondaryOrange

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CourtDetailScreen(
    courtId: String,
    onBackClick: () -> Unit
) {
    val scrollState = rememberScrollState()
    
    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        "Detalles de la Cancha",
                        color = PrimaryBlue
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Volver",
                            tint = PrimaryBlue
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = PrimaryBlue,
                    titleContentColor = SecondaryOrange,
                    navigationIconContentColor = SecondaryOrange
                )
            )
        },
        content = { paddingValues ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .verticalScroll(scrollState)
            ) {
                // Court Image/Header
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp)
                        .padding(16.dp),
                    colors = CardDefaults.cardColors(containerColor = PrimaryBlue)
                ) {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            "IMAGEN DE LA CANCHA",
                            style = MaterialTheme.typography.titleLarge,
                            color = SecondaryOrange
                        )
                    }
                }
                
                // Court Information
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Text(
                            "Cancha de Fútbol ${courtId.take(4)}",
                            style = MaterialTheme.typography.titleLarge,
                            color = PrimaryBlue,
                            fontWeight = FontWeight.Bold
                        )
                        
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        // Location
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.LocationOn,
                                contentDescription = "Ubicación",
                                tint = SecondaryOrange
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                "Av. Principal 123, Ciudad Deportiva",
                                color = PrimaryBlue
                            )
                        }
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        // Schedule
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Schedule,
                                contentDescription = "Horario",
                                tint = SecondaryOrange
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                "Lun-Dom: 8:00 - 22:00",
                                color = PrimaryBlue
                            )
                        }
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        // Sports
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Sports,
                                contentDescription = "Deportes",
                                tint = SecondaryOrange
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                "Fútbol 11 • Fútbol 7 • Fútbol 5",
                                color = PrimaryBlue
                            )
                        }
                    }
                }
                
                // Price and Booking Section
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    colors = CardDefaults.cardColors(containerColor = PrimaryBlue)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Text(
                            "Precio por hora:",
                            style = MaterialTheme.typography.bodyLarge,
                            color = SecondaryOrange
                        )
                        
                        Text(
                            "$25.000",
                            style = MaterialTheme.typography.titleLarge,
                            color = SecondaryOrange,
                            fontWeight = FontWeight.Bold
                        )
                        
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        Button(
                            onClick = { /* Lógica de reserva */ },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = SecondaryOrange,
                                contentColor = PrimaryBlue
                            )
                        ) {
                            Text("Reservar Ahora", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    )
}
