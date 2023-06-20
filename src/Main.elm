module Main exposing (ApiResponse, DisplayName, Model, Msg(..), decoder, displayNameDecoder, displayNameView, displayNamesView, errorView, footerView, handler, init, main, subscriptions, update, view)

import Browser
import Html exposing (Html, a, br, div, footer, h1, img, li, ol, span, text, ul)
import Html.Attributes exposing (class, reversed)
import Http
import Json.Decode exposing (bool, list, string)
import Markdown


type Msg
    = GotDisplayNames (List DisplayName)
    | GotError Http.Error


type alias Model =
    { displayNames : List DisplayName
    , error : Maybe Http.Error
    , loading : Bool
    }


type alias ApiResponse =
    { success : Bool
    , data : List DisplayName
    }


type alias DisplayName =
    { name : Maybe String }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotDisplayNames displayNames ->
            ( { model | displayNames = displayNames, loading = False }, Cmd.none )

        GotError error ->
            ( { model | error = Just error, loading = False }, Cmd.none )


view : Model -> Browser.Document Msg
view model =
    { title = "Ken Wheeler's display names"
    , body =
        [ div []
            [ div [ class "main" ]
                [ h1 [] [ text "@ken_wheeler – also known as" ]
                , div [ class "since" ] [ text "Since 2018-06-27 (note: missing data between 11/2020 and 06/2023)" ]
                , if model.loading == True then
                    div [ class "loading" ] [ text "Loading..." ]

                  else
                    displayNamesView model.displayNames
                , errorView model.error
                ]
            , footer [] [ footerView ]
            ]
        ]
    }


displayNamesView : List DisplayName -> Html msg
displayNamesView displayNames =
    displayNames
        |> List.reverse
        |> List.map displayNameView
        |> ol [ class "display-names", reversed True ]


displayNameView : DisplayName -> Html msg
displayNameView displayName =
    case displayName.name of
        Just name ->
            li [] [ text name ]

        Nothing ->
            li [ class "error" ] [ text "Error: Invalid data – possibly \"undefined\" or \"null\"" ]


errorView : Maybe Http.Error -> Html msg
errorView err =
    case err of
        Just e ->
            case e of
                Http.NetworkError ->
                    text "No connection, try again later."

                Http.Timeout ->
                    text "Network timed out."

                Http.BadUrl _ ->
                    text "It's not you, it's me. I have the server address wrong."

                Http.BadStatus _ ->
                    text "The server didn't like the request (bad status)."

                Http.BadPayload _ _ ->
                    text "Ouch, the server responded with strange contents."

        Nothing ->
            text ""


footerView : Html msg
footerView =
    Markdown.toHtml [] """
* Built by [0lpeh](https://twitter.com/0lpeh)
* Repository available at [GitHub](https://github.com/olpeh/ken-wheeler-aka)
* Follow [@ken_wheeler_aka](https://twitter.com/ken_wheeler_aka)
"""


type alias Flags =
    { apiBaseUrl : String }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { displayNames = []
      , error = Nothing
      , loading = True
      }
    , Http.send handler (Http.get flags.apiBaseUrl decoder)
    )


decoder : Json.Decode.Decoder ApiResponse
decoder =
    Json.Decode.map2 ApiResponse
        (Json.Decode.at [ "success" ] bool)
        (Json.Decode.at [ "data" ] (list displayNameDecoder))


displayNameDecoder : Json.Decode.Decoder DisplayName
displayNameDecoder =
    Json.Decode.map DisplayName
        (Json.Decode.maybe (Json.Decode.field "name" Json.Decode.string))


handler : Result Http.Error ApiResponse -> Msg
handler result =
    case result of
        Ok apiResponse ->
            GotDisplayNames apiResponse.data

        Err error ->
            GotError error


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


main : Program Flags Model Msg
main =
    Browser.document
        { view = view
        , init = init
        , update = update
        , subscriptions = subscriptions
        }
