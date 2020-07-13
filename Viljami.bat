@echo off
setLocal EnableDelayedExpansion
for /F "usebackq tokens=2* delims=: " %%W in (`mode con ^| findstr Columns`) do set CONSOLE_WIDTH=%%W
set "STR=Viljami application launcher 0.2.0"
set "SIZE=%CONSOLE_WIDTH%"

set "LEN=0"
:strLen_Loop
   if not "!!STR:~%LEN%!!"=="" set /A "LEN+=1" & goto :strLen_Loop

set "splitter=------------------------------------------------------------------------------------------------------------------------------------"
set "spaces=                                                                                                                                                    "

set /a "pref_len=%SIZE%-%LEN%-2"
set /a "pref_len/=2"
set /a "suf_len=%SIZE%-%LEN%-2-%pref_len%"
echo.
call echo %%spaces:~0,%pref_len%%%%%STR%%%%spaces:~0,%suf_len%%%
echo.
call echo %%splitter:~0,%SIZE%%%
echo.
endLocal

set restart=0
set "application=./lib/nw-dev/nw.exe ./ --mixed-content"

if exist ./lib/nw/nw.exe (
    echo [RUNTIME]: Launching application...
    start %application%
    EXIT /B 0
) else (
    :launch
    node index.js
    echo.
    echo Code: %errorlevel%
    echo.
    if not errorlevel 1 goto no_error
        if %errorlevel% == 2 (
            echo [RUNTIME]: Application needs to restart
            if %restart% == 2 (
                echo [RUNTIME]: Too many restarts, application will exit. This is a bug, please report any errors logged above.
                echo Press any key to exit...
                pause >nul
                EXIT /B 0
            )
            timeout 5
            set /a "restart=%restart%+1"
            CALL :launch
        ) else if %errorlevel% == 1 (
            echo [RUNTIME]: An unexpected error occured. There should be additional information above.
            echo Press any key to exit...
            pause >nul
            EXIT /B 0
        ) else (
            echo [RUNTIME]: Launching application...
            start %application%
        )
    :no_error
    if not %restart% == 2 (
        echo [RUNTIME]: An unexpected error occured. There should be additional information above.
        echo Press any key to exit...
        pause >nul
    )
    EXIT /B 0
    call :launch
)