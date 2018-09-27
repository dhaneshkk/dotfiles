@if "%DEBUG%" == "" @echo off
@rem ##########################################################################
@rem
@rem  languagetool-languageserver startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%..

@rem Add default JVM options here. You can also use JAVA_OPTS and LANGUAGETOOL_LANGUAGESERVER_OPTS to pass JVM options to this script.
set DEFAULT_JVM_OPTS=

@rem Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if "%ERRORLEVEL%" == "0" goto init

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto init

echo.
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto fail

:init
@rem Get command-line arguments, handling Windows variants

if not "%OS%" == "Windows_NT" goto win9xME_args

:win9xME_args
@rem Slurp the command line arguments.
set CMD_LINE_ARGS=
set _SKIP=2

:win9xME_args_slurp
if "x%~1" == "x" goto execute

set CMD_LINE_ARGS=%*

:execute
@rem Setup the command line

set CLASSPATH=%APP_HOME%\lib\languagetool-languageserver-0.0-SNAPSHOT.jar;%APP_HOME%\lib\languagetool-core-3.8.jar;%APP_HOME%\lib\org.eclipse.lsp4j-0.2.0.jar;%APP_HOME%\lib\flexmark-all-0.19.1.jar;%APP_HOME%\lib\commons-lang3-3.5.jar;%APP_HOME%\lib\guava-21.0.jar;%APP_HOME%\lib\jna-4.4.0.jar;%APP_HOME%\lib\morfologik-fsa-2.1.3.jar;%APP_HOME%\lib\morfologik-fsa-builders-2.1.3.jar;%APP_HOME%\lib\morfologik-speller-2.1.3.jar;%APP_HOME%\lib\morfologik-stemming-2.1.3.jar;%APP_HOME%\lib\hppc-0.7.2.jar;%APP_HOME%\lib\segment-2.0.0.jar;%APP_HOME%\lib\language-detector-0.6.jar;%APP_HOME%\lib\annotations-12.0.jar;%APP_HOME%\lib\lucene-core-5.5.3.jar;%APP_HOME%\lib\lucene-backward-codecs-5.5.3.jar;%APP_HOME%\lib\berkeleylm-1.1.2.jar;%APP_HOME%\lib\jackson-databind-2.8.4.jar;%APP_HOME%\lib\org.eclipse.lsp4j.generator-0.2.0.jar;%APP_HOME%\lib\org.eclipse.lsp4j.jsonrpc-0.2.0.jar;%APP_HOME%\lib\flexmark-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-abbreviation-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-anchorlink-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-aside-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-autolink-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-definition-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-emoji-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-escaped-character-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-footnotes-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-gfm-strikethrough-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-gfm-tables-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-gfm-tasklist-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-jekyll-front-matter-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-jekyll-tag-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-ins-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-xwiki-macros-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-spec-example-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-superscript-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-tables-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-toc-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-typographic-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-wikilink-0.19.1.jar;%APP_HOME%\lib\flexmark-ext-yaml-front-matter-0.19.1.jar;%APP_HOME%\lib\flexmark-formatter-0.19.1.jar;%APP_HOME%\lib\flexmark-html-parser-0.19.1.jar;%APP_HOME%\lib\flexmark-jira-converter-0.19.1.jar;%APP_HOME%\lib\flexmark-pdf-converter-0.19.1.jar;%APP_HOME%\lib\flexmark-profile-pegdown-0.19.1.jar;%APP_HOME%\lib\flexmark-util-0.19.1.jar;%APP_HOME%\lib\flexmark-youtrack-converter-0.19.1.jar;%APP_HOME%\lib\jsonic-1.2.11.jar;%APP_HOME%\lib\slf4j-api-1.7.6.jar;%APP_HOME%\lib\jackson-annotations-2.8.0.jar;%APP_HOME%\lib\jackson-core-2.8.4.jar;%APP_HOME%\lib\org.eclipse.xtend.lib-2.12.0.jar;%APP_HOME%\lib\gson-2.7.jar;%APP_HOME%\lib\autolink-0.6.0.jar;%APP_HOME%\lib\flexmark-test-util-0.19.1.jar;%APP_HOME%\lib\jsoup-1.10.2.jar;%APP_HOME%\lib\openhtmltopdf-core-0.0.1-RC9.jar;%APP_HOME%\lib\openhtmltopdf-pdfbox-0.0.1-RC9.jar;%APP_HOME%\lib\openhtmltopdf-rtl-support-0.0.1-RC9.jar;%APP_HOME%\lib\openhtmltopdf-jsoup-dom-converter-0.0.1-RC9.jar;%APP_HOME%\lib\org.eclipse.xtext.xbase.lib-2.12.0.jar;%APP_HOME%\lib\org.eclipse.xtend.lib.macro-2.12.0.jar;%APP_HOME%\lib\junit-4.12.jar;%APP_HOME%\lib\pdfbox-2.0.4.jar;%APP_HOME%\lib\icu4j-58.1.jar;%APP_HOME%\lib\hamcrest-core-1.3.jar;%APP_HOME%\lib\fontbox-2.0.4.jar;%APP_HOME%\lib\commons-logging-1.2.jar

@rem Execute languagetool-languageserver
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %LANGUAGETOOL_LANGUAGESERVER_OPTS%  -classpath "%CLASSPATH%" App %CMD_LINE_ARGS%

:end
@rem End local scope for the variables with windows NT shell
if "%ERRORLEVEL%"=="0" goto mainEnd

:fail
rem Set variable LANGUAGETOOL_LANGUAGESERVER_EXIT_CONSOLE if you need the _script_ return code instead of
rem the _cmd.exe /c_ return code!
if  not "" == "%LANGUAGETOOL_LANGUAGESERVER_EXIT_CONSOLE%" exit 1
exit /b 1

:mainEnd
if "%OS%"=="Windows_NT" endlocal

:omega
