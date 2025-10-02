package com.example.canchasapp.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme = lightColorScheme(
    primary = PrimaryBlue,
    onPrimary = OnPrimary,
    secondary = SecondaryOrange,
    onSecondary = OnSecondary,
    background = BackgroundWhite,
    onBackground = OnBackground,
    surface = SurfaceWhite,
    onSurface = OnSurface
)

@Composable
fun CanchasAppTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        typography = Typography,
        content = content
    )
}
